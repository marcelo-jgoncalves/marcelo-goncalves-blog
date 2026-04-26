#!/usr/bin/env bash
# scripts/bootstrap-state.sh
# Creates the S3 bucket and DynamoDB table for Terraform remote state.
# Run ONCE per AWS account/environment before the first `terraform init`.
#
# Usage:
#   ENV=dev   AWS_PROFILE=devops-blog-dev   bash scripts/bootstrap-state.sh
#   ENV=prod  AWS_PROFILE=devops-blog-prod  bash scripts/bootstrap-state.sh

set -euo pipefail

ENV="${ENV:-dev}"
PROJECT="marcelo-goncalves-blog"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
BUCKET="${PROJECT}-${ENV}-tfstate"
TABLE="${PROJECT}-${ENV}-tflock"

echo "==> Bootstrapping Terraform remote state for ENV=${ENV}"
echo "    Bucket : ${BUCKET}"
echo "    Table  : ${TABLE}"
echo "    Region : ${REGION}"
echo ""

# --- S3 Bucket ---
if aws s3api head-bucket --bucket "${BUCKET}" 2>/dev/null; then
  echo "    [skip] S3 bucket already exists"
else
  echo "==> Creating S3 bucket..."
  if [ "${REGION}" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "${BUCKET}" --region "${REGION}"
  else
    aws s3api create-bucket --bucket "${BUCKET}" --region "${REGION}" \
      --create-bucket-configuration LocationConstraint="${REGION}"
  fi

  aws s3api put-bucket-versioning \
    --bucket "${BUCKET}" \
    --versioning-configuration Status=Enabled

  aws s3api put-bucket-encryption \
    --bucket "${BUCKET}" \
    --server-side-encryption-configuration '{
      "Rules": [{
        "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
        "BucketKeyEnabled": true
      }]
    }'

  aws s3api put-public-access-block \
    --bucket "${BUCKET}" \
    --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

  echo "    [ok] S3 bucket created and secured"
fi

# --- DynamoDB Table ---
if aws dynamodb describe-table --table-name "${TABLE}" 2>/dev/null; then
  echo "    [skip] DynamoDB table already exists"
else
  echo "==> Creating DynamoDB lock table..."
  aws dynamodb create-table \
    --table-name "${TABLE}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}"

  aws dynamodb wait table-exists --table-name "${TABLE}" --region "${REGION}"
  echo "    [ok] DynamoDB table created"
fi

echo ""
echo "==> Bootstrap complete. Next steps:"
echo "    1. Copy infra/backend.hcl.example to infra/backend.hcl"
echo "    2. Set bucket = \"${BUCKET}\" in backend.hcl"
echo "    3. Set dynamodb_table = \"${TABLE}\" in backend.hcl"
echo "    4. Run: terraform init -backend-config=backend.hcl -var-file=env/${ENV}.tfvars"
