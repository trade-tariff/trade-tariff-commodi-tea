locals {
  cognito_custom_domain = "https://auth.${var.base_domain}"
  cognito_pool_url      = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${data.aws_cognito_user_pools.this.id}"
  init_command          = ["/bin/sh", "-c", "npx sequelize-cli db:migrate"]
  service               = "tea"
}
