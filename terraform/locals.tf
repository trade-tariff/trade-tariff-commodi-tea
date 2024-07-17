locals {
  service   = "tea"
  db_secret = data.aws_secretsmanager_secret_version.db_secret_version.secret_string
}
