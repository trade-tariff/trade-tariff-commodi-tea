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
}

resource "aws_iam_policy" "task" {
  name   = "${local.service}-task-role-policy"
  policy = data.aws_iam_policy_document.task.json
}
