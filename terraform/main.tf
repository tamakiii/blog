terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.27.0"
    }
  }

  backend "s3" {
    bucket = "terraform.s3.tamakiii.com"
    key    = "blog/terraform.tfstate"
    region = "ap-northeast-1"
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

data "aws_route53_zone" "tamakiii_com" {
  name = "tamakiii.com."
}

resource "aws_route53_record" "blog" {
  zone_id = data.aws_route53_zone.tamakiii_com.zone_id
  name    = "blog.tamakiii.com"
  type    = "CNAME"
  ttl     = 300
  records = ["tamakiii.github.io"]
}
