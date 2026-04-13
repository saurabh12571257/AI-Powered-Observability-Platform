module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  name               = "lumina-eks"
  kubernetes_version = "1.29"

  vpc_id     = var.vpc_id
  subnet_ids = var.subnets

  eks_managed_node_groups = {
    default = {
      desired_size = 2
      instance_types = [var.instance_type]
    }
  }
}