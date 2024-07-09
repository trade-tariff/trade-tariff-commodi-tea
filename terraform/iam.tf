data "aws_iam_policy_document" "exec" {
  statement {
    effect = "Allow"
    actions = [
      "kms:Decrypt",
      "kms:Encrypt",
      "kms:GenerateDataKeyPair",
      "kms:GenerateDataKeyPairWithoutPlainText",
      "kms:GenerateDataKeyWithoutPlaintext",
      "kms:ReEncryptFrom",
      "kms:ReEncryptTo",
    ]
    resources = [
      data.aws_kms_key.secretsmanager_key.arn
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    ]
    resources = [
      data.aws_secretsmanager_secret.encryption_key.arn,
      data.aws_secretsmanager_secret.sentry_dsn.arn
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "ssm:DescribeParameters",
      "ssm:GetParameter",
      "ssm:GetParameters",
    ]
    resources = [
      data.aws_ssm_parameter.cognito_public_keys_url.arn
    ]
  }
}

resource "aws_iam_policy" "exec" {
  name   = "${local.service}-execution-role-policy"
  policy = data.aws_iam_policy_document.exec.json
}

data "aws_iam_policy_document" "task" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
    ]
    resources = [
      data.aws_dynamodb_table.audit_log.arn,
      data.aws_dynamodb_table.customer_api_keys.arn,
      data.aws_dynamodb_table.organisations.arn,
      data.aws_dynamodb_table.users.arn
    ]
  }

  statement {
    effect    = "Allow"
    actions   = ["apigateway:*"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "task" {
  name   = "${local.service}-task-role-policy"
  policy = data.aws_iam_policy_document.task.json
}
