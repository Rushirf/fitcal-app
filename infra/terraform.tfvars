# VPC
vpc_cidr = "10.200.0.0/16"

public_subnets = {

  public_subnet_1 = {
    cidr_block = "10.200.1.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = true
    name = "fitcalapp-public-subnet-a"
  },

  public_subnet_2 = {
    cidr_block = "10.200.2.0/24"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = true
    name = "fitcalapp-public-subnet-b"
  }
}

private_subnets = {

  private_subnet_1 = {
    cidr_block = "10.200.3.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = false
    name = "fitcalapp-private-subnet-a"
  },

  private_subnet_2 = {
    cidr_block = "10.200.4.0/24"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = false
    name = "fitcalapp-private-subnet-b"
  }
}

security_groups = {

  rds-sg = {
    name = "fitcal-rds-sg"
    description = "security group for fitcal app rds db"

    ingress_rules = [
      {
        from_port = "3306"
        to_port = "3306"
        protocol = "tcp"
        cidr_blocks = ["10.200.4.0/24","10.200.3.0/24"]
      }
    ]

    egress_rules = [
      {
        from_port = "0"
        to_port = "0"
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }
    ]
  }

  alb-sg = {
    name = "fitcal-alb-sg"
    description = "security group for fitcal app alb"

    ingress_rules = [
      {
        from_port = "80"
        to_port = "80"
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
      },
      {
        from_port = "443"
        to_port = "443"
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
      }
    ]

    egress_rules = [
      {
        from_port = "0"
        to_port = "0"
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }
    ]
  }

  ec2-sg = {
    name = "fitcal-ec2-sg"
    description = "security group for fitcal app ec2 sg"

    ingress_rules = [
      {
        from_port = "443"
        to_port = "443"
        protocol = "tcp"
        cidr_blocks = ["10.200.1.0/24","10.200.2.0/24"]
      },
      {
        from_port = "80"
        to_port = "80"
        protocol = "tcp"
        cidr_blocks = ["10.200.1.0/24","10.200.2.0/24"]
      },
      {
        from_port = "8000"
        to_port = "8000"
        protocol = "tcp"
        cidr_blocks = ["10.200.1.0/24","10.200.2.0/24"]
      },
      {
        from_port = "22"
        to_port = "22"
        protocol = "tcp"
        cidr_blocks = ["10.200.1.0/24","10.200.2.0/24"]
      }
    ]

    egress_rules = [
      {
        from_port = "0"
        to_port = "0"
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }
    ]

  }
} 

rds = {

  instance = {
    identifier                  = "fitcal-rds"
    db_name                     = "fitcal"
    instance_class              = "db.t3.micro"
    allocated_storage           = "20"
    engine                      = "mysql"
    engine_version              = "8.0"
    username                    = "rushi"
    deletion_protection         = false
    manage_master_user_password = true
    multi_az                    = false
    skip_final_snapshot         = true
    apply_immediately           = true
  }

  parameter_group = {
    name = "fitcal-rds-pg"
    family = "mysql8.0"
  }

  subnet_group = {
    name = "fitcal-rds-subnet-group"
  }
}

#------------------------------------------------------------------Beanstalk-------------------------------------------------------------------------------- 
beanstalk = {

  application = {
    name = "fitcal-app"
  },

  environment = {
    name = "fitcal-app-env"
    tier = "WebServer"
    solution_stack_name = "64bit Amazon Linux 2023 v4.7.4 running Python 3.11"

    settings = [
      {
        namespace = "aws:autoscaling:asg"
        name      = "MinSize"
        value     = "2"
      },
      {
        namespace = "aws:autoscaling:asg"
        name      = "MaxSize"
        value     = "2"
      },
      {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "EC2KeyName"
        value     = "rushiaws"
      },
      {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "InstanceType"
        value     = "t3.micro"
      },
      {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "DisableDefaultEC2SecurityGroup"
        value     = false
      },
      {
        namespace = "aws:elasticbeanstalk:environment"
        name      = "EnvironmentType"
        value     = "LoadBalanced"
      },
      {
        namespace = "aws:elasticbeanstalk:environment"
        name      = "LoadBalancerType"
        value     = "application"
      },
      {
        namespace = "aws:ec2:vpc"
        name      = "ELBScheme"
        value     = "public"
      },
      {
        namespace = "aws:ec2:vpc"
        name      = "AssociatePublicIpAddress"
        value     = false
      },
      {
        namespace = "aws:elbv2:listener:default"
        name      = "DefaultProcess"
        value     = "default"
      },
      {
        namespace = "aws:elbv2:listener:443"
        name      = "DefaultProcess"
        value     = "default"
      },
      {
        namespace = "aws:elbv2:listener:443"
        name      = "Protocol"
        value     = "HTTPS"
      },
      {
        namespace = "aws:elbv2:listener:443"
        name      = "SSLCertificateArns"
        value     = "arn:aws:acm:us-east-1:086227530319:certificate/65f6c3f7-b2be-4d30-90aa-f8f8932cae73"
      },
      {
        namespace = "aws:elasticbeanstalk:environment:process:default"
        name      = "Port"
        value     = "8000"
      },
      {
        namespace = "aws:elasticbeanstalk:application:environment"
        name      = "WHITE_URL"
        value     = "https://myfitcal.hitmann.xyz"
      },
    ]

  }

}


#---------------------------------------------------------------------------------IAM---------------------------------------------------------------------
iam = {

  roles = {

    beanstalk-service-role = {

      name = "fitcal-beanstalk-service-role"
      policies = ["arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth", "arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"]

    }

    beanstalk-ec2-role = {
      name = "fitcal-beanstalk-ec2-role"
      policies = ["arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM", "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
                  "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker", "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier",
                  "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier", "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
      ]
    }

    beanstalk-ec2-instance-profile = {
      name = "fitcal-beanstalk-ec2-instance-profile"
    }

  }
}


#--------------------------------------------------------------------------s3-Bucket------------------------------------------------------------------

s3 = {
  bucket_name           = "fitcal-s3-frontend-bucket"
  force_destroy         = true
  versioning            = "Enabled"
  index_document_suffix = "index.html"
  error_document_key    = "index.html"

  cors = {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    expose_headers  = []
  }

  pab = {
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
  }
}


#-------------------------------------------------------------------------CloudFront------------------------------------------------------------------

cloudfront = {
  origin_access_control = {
    name                              = "fitcal-cloudfront-origin-access-control"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
    s3_origin_id = "myS3Origin"
  }

  geo_restrictions = {
    locations = []
    restriction_type = "none"
  }

  aliases = ["myfitcal.hitmann.xyz"]
  enabled = true
  default_root_object = "index.html"

  default_cache_behavior = {
    allowed_methods            = ["GET", "HEAD"]
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "myS3Origin"
    viewer_protocol_policy     = "redirect-to-https"
  }

  viewer_certificate = {
    acm_certificate_arn            = "arn:aws:acm:us-east-1:086227530319:certificate/65f6c3f7-b2be-4d30-90aa-f8f8932cae73"
    ssl_support_method             = "sni-only"
  }
}