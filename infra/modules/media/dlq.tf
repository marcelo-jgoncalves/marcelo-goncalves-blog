# imageProcessor DLQ — async invocation (S3 -> Lambda): without a failure
# destination, AWS retries twice and then DISCARDS the event forever — the
# image variants are never generated and there is nothing left to reprocess.
# on_failure destination (not the classic dead_letter_config): the message
# carries the payload AND the error context, not just the payload.

resource "aws_sqs_queue" "image_processor_dlq" {
  name = "${var.project_name}-${var.environment}-imageProcessor-dlq"

  # Max SQS retention — the queue only receives messages on failure and
  # reprocessing is manual; 14 days leaves room to investigate without loss.
  message_retention_seconds = 1209600
}

resource "aws_lambda_function_event_invoke_config" "image_processor" {
  function_name = aws_lambda_function.image_processor.function_name

  maximum_retry_attempts = 2

  destination_config {
    on_failure {
      destination = aws_sqs_queue.image_processor_dlq.arn
    }
  }
}

# Destinations publish to the queue using the function's own execution role.
resource "aws_iam_policy" "image_processor_dlq_policy" {
  name = "${var.project_name}-${var.environment}-imageProcessor-dlq-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["sqs:SendMessage"]
      Effect   = "Allow"
      Resource = aws_sqs_queue.image_processor_dlq.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "image_processor_dlq_attach" {
  role       = aws_iam_role.processor_role.name
  policy_arn = aws_iam_policy.image_processor_dlq_policy.arn
}

# Dedicated topic and alarm, ALWAYS on — deliberately outside the
# enable_cloudwatch_alarms toggle (off in dev for cost): any message in this
# queue is a genuinely lost event, and 1 alarm + SNS costs ~zero. Without
# this, the DLQ becomes a silent graveyard.
resource "aws_sns_topic" "image_processor_dlq_alerts" {
  name = "${var.project_name}-${var.environment}-imageProcessor-dlq-alerts"
}

resource "aws_sns_topic_subscription" "image_processor_dlq_email" {
  count     = var.dlq_alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.image_processor_dlq_alerts.arn
  protocol  = "email"
  endpoint  = var.dlq_alert_email
}

resource "aws_cloudwatch_metric_alarm" "image_processor_dlq_depth" {
  alarm_name          = "${var.project_name}-${var.environment}-imageProcessor-dlq-depth"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Maximum"
  threshold           = 1
  alarm_description   = "Event lost by imageProcessor after retries — inspect the DLQ and reprocess (image variants not generated)"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.image_processor_dlq.name
  }

  alarm_actions = [aws_sns_topic.image_processor_dlq_alerts.arn]
  ok_actions    = [aws_sns_topic.image_processor_dlq_alerts.arn]
}
