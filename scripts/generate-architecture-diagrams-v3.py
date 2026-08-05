"""Generates a set of focused AWS architecture diagrams (docs/architecture/architecture-v3-*).

Source of truth: infra/ (Terraform modules). A single all-in-one diagram
(see generate-architecture-diagram.py, v2) becomes unreadable once every
flow is drawn on the same graph. This script splits the same information
into one overview + one diagram per concern, each small enough to read
without following crossing lines:

  01-overview      - C4-style context: layers only, no per-Lambda detail
  02-public-read   - visitor request path (blog, SSR/ISR, public API/data)
  03-admin-bff     - editor auth + admin CRUD + BFF session
  04-media-async   - image pipeline + scheduled publishing (no API route)
  05-observability - monitoring, audit, alerting fan-in (cross-cutting)

Re-run whenever the infrastructure topology changes materially.
"""

import glob

from PIL import Image

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.integration import SNS, SQS, Eventbridge
from diagrams.aws.management import Cloudtrail, Cloudwatch
from diagrams.aws.mobile import Amplify
from diagrams.aws.network import CloudFront, APIGateway
from diagrams.aws.security import Cognito, Guardduty
from diagrams.aws.storage import S3
from diagrams.onprem.client import Users

GRAPH_ATTR = {
    "fontsize": "13",
    "bgcolor": "white",
    "pad": "0.4",
    "splines": "spline",
    "nodesep": "1.4",
    "ranksep": "0.85",
}
NODE_ATTR = {"fontsize": "12"}


def new_diagram(name: str, title: str) -> Diagram:
    return Diagram(
        title,
        filename=f"docs/architecture/architecture-v3-{name}",
        outformat=["png", "svg"],
        graph_attr=GRAPH_ATTR,
        node_attr=NODE_ATTR,
        show=False,
        direction="TB",
    )


# ---------------------------------------------------------------------------
# 01 - Overview (C4-style context, layers only)
# ---------------------------------------------------------------------------
with new_diagram("01-overview", "Marcelo Gonçalves Platform - Architecture overview"):
    users = Users("Visitor / Editor")

    with Cluster("Edge / CDN"):
        cf_public = CloudFront("CloudFront\nPublic frontend")
        cf_admin = CloudFront("CloudFront\nAdmin (SPA)")

    with Cluster("Applications"):
        nextjs = Lambda("Public frontend\n(Next.js SSR/ISR)")
        admin_spa = S3("Admin\n(static Vue SPA)")

    with Cluster("Authentication"):
        cognito = Cognito("Cognito\n(admin, SRP)")

    apigw = APIGateway("API Gateway\n(REST, stage v1)")

    with Cluster("Compute (12 Lambdas)"):
        lambdas_public = Lambda("Public reads\n(getPost, getPosts, getAuthor)")
        lambdas_admin = Lambda("Admin CRUD + BFF\n(adminPosts/Authors/Categorias,\nadminSession, adminAuthorizer,\nmediaUpload)")
        lambdas_async = Lambda("Async\n(postScheduler, imageProcessor,\npostCounterReconciler)")

    with Cluster("Data & Media"):
        data = Dynamodb("DynamoDB\n(posts, autores,\ncategorias, admin_sessions)")
        media = S3("S3\n(assets, uploads-raw)")

    with Cluster("Reliability & Observability"):
        reliability = SQS("DLQ + SNS\n(alerts)")
        observability = Cloudwatch("CloudWatch, CloudTrail,\nGuardDuty")

    users >> Edge(label="HTTPS") >> cf_public
    users >> Edge(label="HTTPS") >> cf_admin
    cf_public >> nextjs
    cf_admin >> admin_spa
    cf_admin >> Edge(label="/admin/* proxy") >> apigw
    nextjs >> Edge(label="fetch") >> apigw
    admin_spa >> Edge(label="SRP login", style="dashed") >> cognito

    apigw >> lambdas_public
    apigw >> lambdas_admin
    lambdas_public >> data
    lambdas_admin >> data
    lambdas_admin >> Edge(style="dashed") >> media
    lambdas_admin >> Edge(label="validates token", style="dashed") >> cognito

    lambdas_async >> data
    lambdas_async >> Edge(style="dashed") >> media
    lambdas_async >> Edge(label="on_failure", color="red", style="dashed") >> reliability

    observability >> Edge(style="dotted", color="gray60", constraint="false") >> apigw


# ---------------------------------------------------------------------------
# 02 - Public read path (visitor request)
# ---------------------------------------------------------------------------
with new_diagram("02-public-read", "Public read path (visitor request)"):
    visitor = Users("Visitor")

    cf_public = CloudFront("CloudFront\nPublic frontend")

    with Cluster("Public frontend (Next.js)"):
        nextjs = Lambda("nextjs-server\n(SSR/ISR)")
        assets_bucket = S3("S3: assets\n(static + media/*)")

    apigw = APIGateway("API Gateway")

    with Cluster("Public read Lambdas"):
        get_post = Lambda("getPost")
        get_posts = Lambda("getPosts\n(recent, popular, articles,\ncategory, search, project)")
        get_author = Lambda("getAuthor")

    with Cluster("DynamoDB"):
        posts_table = Dynamodb("posts")
        autores_table = Dynamodb("autores")
        categorias_table = Dynamodb("categorias")

    visitor >> Edge(label="HTTPS") >> cf_public
    cf_public >> Edge(label="OAC (S3)") >> assets_bucket
    cf_public >> Edge(label="OAC + SigV4\n(Lambda URL)") >> nextjs
    nextjs >> Edge(label="fetch API_URL") >> apigw

    apigw >> Edge(label="GET /post/{slug}") >> get_post
    apigw >> Edge(label="GET /posts/recentes,\n/posts/populares, /artigos,\n/categoria, /busca, /projeto") >> get_posts
    apigw >> Edge(label="GET /autor/{id}") >> get_author

    get_post >> posts_table
    get_post >> autores_table
    get_post >> categorias_table
    get_posts >> posts_table
    get_posts >> categorias_table
    get_author >> autores_table


# ---------------------------------------------------------------------------
# 03 - Admin / BFF (editor session + CRUD)
# ---------------------------------------------------------------------------
with new_diagram("03-admin-bff", "Admin session (BFF) and editorial CRUD"):
    editor = Users("Editor")

    cf_admin = CloudFront("CloudFront\nAdmin (SPA)")

    with Cluster("Admin (Vue SPA)"):
        admin_bucket = S3("S3: admin-assets")
        amplify = Amplify("Auth client\n(Amplify)")

    cognito = Cognito("Cognito User Pool\n(SRP)")

    apigw = APIGateway("API Gateway")

    with Cluster("Session BFF"):
        admin_session = Lambda("adminSession\n(login / me / logout)")
        admin_authorizer = Lambda("adminAuthorizer\n(REQUEST authorizer)")

    with Cluster("Editorial CRUD (CUSTOM auth)"):
        admin_posts = Lambda("adminPosts")
        admin_authors = Lambda("adminAuthors")
        admin_categorias = Lambda("adminCategorias")
        media_upload = Lambda("mediaUpload\n(presigned URL)")

    with Cluster("Data"):
        sessions_table = Dynamodb("admin_sessions\n(TTL)")
        posts_table = Dynamodb("posts")
        autores_table = Dynamodb("autores")
        categorias_table = Dynamodb("categorias")

    uploads_bucket = S3("S3: uploads-raw")

    editor >> Edge(label="HTTPS") >> cf_admin
    cf_admin >> Edge(label="OAC") >> admin_bucket
    cf_admin >> Edge(label="/admin/* proxy\n(httpOnly cookie)") >> apigw
    admin_bucket >> amplify
    amplify >> Edge(label="SRP login") >> cognito

    apigw >> Edge(label="POST/GET/DELETE\n/admin/session") >> admin_session
    apigw >> Edge(label="CUSTOM authorizer", style="dotted") >> admin_authorizer
    apigw >> Edge(label="/admin/posts*") >> admin_posts
    apigw >> Edge(label="/admin/autor/{id}") >> admin_authors
    apigw >> Edge(label="/admin/categorias*") >> admin_categorias
    apigw >> Edge(label="/admin/media/upload-url") >> media_upload

    admin_session >> Edge(label="validates idToken (JWKS)", style="dashed") >> cognito
    admin_session >> Edge(label="Put/Get/Delete") >> sessions_table
    admin_authorizer >> Edge(label="GetItem") >> sessions_table

    admin_posts >> posts_table
    admin_authors >> autores_table
    admin_categorias >> categorias_table
    media_upload >> Edge(label="presigned URL", style="dashed") >> uploads_bucket
    admin_posts >> Edge(label="CreateInvalidation", style="dashed", color="gray40") >> cf_admin


# ---------------------------------------------------------------------------
# 04 - Media pipeline + scheduled publishing (async, no API route)
# ---------------------------------------------------------------------------
with new_diagram("04-media-async", "Media pipeline and scheduled publishing"):
    with Cluster("Upload (via mediaUpload, outside this diagram)"):
        uploads_bucket = S3("S3: uploads-raw")

    image_processor = Lambda("imageProcessor")
    assets_bucket = S3("S3: assets\n(media/* + variants)")

    eventbridge = Eventbridge("EventBridge\nSchedule (15min)")
    post_scheduler = Lambda("postScheduler")

    eventbridge_reconciler = Eventbridge("EventBridge\nSchedule (daily)")
    post_counter_reconciler = Lambda("postCounterReconciler\n(no DLQ yet - a missed run\nis caught the next day)")

    posts_table = Dynamodb("posts")
    cf_public = CloudFront("CloudFront\nPublic frontend")

    with Cluster("Reliability"):
        dlq_image = SQS("DLQ\nimageProcessor")
        dlq_scheduler = SQS("DLQ\npostScheduler")
        sns_alerts = SNS("SNS\n(email alerts)")

    uploads_bucket >> Edge(label="S3 event\nObjectCreated") >> image_processor
    image_processor >> Edge(label="AVIF/WebP variants + LQIP") >> assets_bucket
    image_processor >> Edge(label="UpdateItem") >> posts_table

    eventbridge >> Edge(label="rate(15min)") >> post_scheduler
    post_scheduler >> Edge(label="Query/UpdateItem\n(scheduled -> published)") >> posts_table

    eventbridge_reconciler >> Edge(label="rate(1 day)") >> post_counter_reconciler
    post_counter_reconciler >> Edge(label="Scan + recompute\n(self-heals drifted counters)") >> posts_table

    image_processor >> Edge(label="CreateInvalidation", style="dashed", color="gray40") >> cf_public
    post_scheduler >> Edge(label="CreateInvalidation", style="dashed", color="gray40") >> cf_public

    image_processor >> Edge(label="on_failure", color="red", style="dashed") >> dlq_image
    post_scheduler >> Edge(label="on_failure", color="red", style="dashed") >> dlq_scheduler
    dlq_image >> sns_alerts
    dlq_scheduler >> sns_alerts


# ---------------------------------------------------------------------------
# 05 - Observability & security (cross-cutting)
# ---------------------------------------------------------------------------
with new_diagram("05-observability", "Observability and security (cross-cutting)"):
    with Cluster("Monitored surfaces"):
        apigw = APIGateway("API Gateway")
        nextjs = Lambda("nextjs-server")
        lambdas = Lambda("12 Lambdas\n(errors, throttles, duration)")

    with Cluster("CloudWatch"):
        dashboard = Cloudwatch("Dashboard\n(golden signals)")
        canary = Cloudwatch("Synthetics Canary\n(heartbeat, 15min)")
        slo = Cloudwatch("SLO burn-rate\n(99.5% availability)")

    with Cluster("Account security"):
        cloudtrail = Cloudtrail("CloudTrail\n(multi-region trail)")
        guardduty = Guardduty("GuardDuty")

    with Cluster("Alerts (SNS -> email)"):
        sns_alarms = SNS("lambda_alerts,\napi_alerts, media_alerts")
        sns_page = SNS("page_alerts (fast burn)\nticket_alerts (slow burn)")
        sns_canary = SNS("canary_alerts")

    apigw >> Edge(style="dotted", color="gray60") >> dashboard
    nextjs >> Edge(style="dotted", color="gray60") >> dashboard
    lambdas >> Edge(style="dotted", color="gray60") >> dashboard
    apigw >> Edge(style="dotted", color="gray60") >> cloudtrail

    dashboard >> Edge(style="dashed") >> sns_alarms
    slo >> Edge(label="burn-rate alarm") >> sns_page
    canary >> Edge(label="failure") >> sns_canary
    apigw >> Edge(label="5xx / p99 latency", style="dotted", color="gray60") >> slo
    nextjs >> Edge(label="heartbeat", style="dotted", color="gray60") >> canary


# ---------------------------------------------------------------------------
# Normalize canvas width across the set: pad every PNG (white background,
# matching graph_attr bgcolor) to the widest diagram's width, centering the
# original drawing horizontally. Diagrams naturally vary in width/height
# depending on how many nodes they show, but displayed side by side (or in
# sequence in the README) they read better lined up on the same width.
# ---------------------------------------------------------------------------
pngs = sorted(glob.glob("docs/architecture/architecture-v3-*.png"))
max_width = max(Image.open(p).width for p in pngs)

for path in pngs:
    img = Image.open(path)
    if img.width == max_width:
        continue
    canvas = Image.new("RGB", (max_width, img.height), "white")
    offset_x = (max_width - img.width) // 2
    canvas.paste(img, (offset_x, 0))
    canvas.save(path)
