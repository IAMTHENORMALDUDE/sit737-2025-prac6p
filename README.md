# SIT737-2025-Prac6P: Kubernetes Deployment of Calculator Microservice

## Overview

This project deploys my calculator microservice from Prac 5.1P to a Kubernetes cluster on Google Kubernetes Engine (GKE). I set up a custom VPC, created a cluster named `sit737-cluster`, and used an access token to grant image pull permissions due to limited IAM access in my GCP project.

## Github Repository

https://github.com/IAMTHENORMALDUDE/sit737-2025-prac6p

## Setup Instructions

### Prerequisites

- Docker, Node.js, Git, `gcloud`, `kubectl` installed.
- GCP project `sit737-25t1-vazirnia-7c6f971` with Kubernetes Engine and Container Registry APIs enabled.

### Step 1: Clone the Repository

```bash
git clone https://github.com/IAMTHENORMALDUDE/sit737-2025-prac6p.git
cd sit737-2025-prac6p
```

### Step 2: Build and Push Docker Image

1. Build the image:
   ```bash
   docker build -t calculator-microservice:latest .
   ```
2. Tag it for my registry:
   ```bash
   docker tag calculator-microservice:latest australia-southeast1-docker.pkg.dev/sit737-25t1-vazirnia-7c6f971/sit737-25t1-vazirnia/calculator-microservice:latest
   ```
3. Authenticate and push:
   ```bash
   gcloud auth configure-docker
   docker push australia-southeast1-docker.pkg.dev/sit737-25t1-vazirnia-7c6f971/sit737-25t1-vazirnia/calculator-microservice:latest
   ```

### Step 3: Create a VPC Network

1. In GCP Console, go to **VPC Network > VPC Networks**.
2. Create a VPC:
   - Name: `sit737-vpc`.
   - Subnet: `sit737-subnet`, region `australia-southeast1`, IP `10.0.0.0/24`.
   - Click **Create**.

### Step 4: Setup GKE Cluster

1. Enable Kubernetes Engine API in GCP Console.
2. Create the cluster:
   - Go to **Kubernetes Engine > Clusters > Create**.
   - Name: `sit737-cluster`.
   - Location: `australia-southeast1`.
   - Network: `sit737-vpc`, Subnet: `sit737-subnet`.
   - Click **Create**.
3. Connect:
   ```bash
   gcloud container clusters get-credentials sit737-cluster --region australia-southeast1
   ```
4. Verify: `kubectl get nodes`.

### Step 5: Grant Image Pull Permissions

Since I couldn’t modify IAM, I used an access token:

1. Authenticate:
   ```bash
   gcloud auth login
   ```
2. Authenticate Docker:
   ```bash
   gcloud auth print-access-token | docker login \
     -u oauth2accesstoken \
     --password-stdin https://australia-southeast1-docker.pkg.dev
   ```
3. Create a secret (run within 60 minutes of token generation):
   ```bash
   kubectl create secret docker-registry gcr-secret \
     --docker-server=https://australia-southeast1-docker.pkg.dev \
     --docker-username=oauth2accesstoken \
     --docker-password="$(gcloud auth print-access-token)" \
     --docker-email=my-deakin-email@deakin.edu.au
   ```
   - Replace `my-deakin-email@deakin.edu.au` with your email.
4. The `deployment.yaml` already includes `imagePullSecrets`.

### Step 6: Deploy to Kubernetes

1. Deploy the app:
   ```bash
   kubectl apply -f deployment.yaml
   ```
2. Expose it:
   ```bash
   kubectl apply -f service.yaml
   ```
3. Get the external IP:
   ```bash
   kubectl get services
   ```
4. Test: `http://[external-ip]/add?num1=5&num2=3` → `{ "result": 8 }`.

## Files

- `Dockerfile`: Defines the Node.js image.
- `deployment.yaml`: Configures 2 replicas with image pull secret.
- `service.yaml`: Exposes the app via LoadBalancer.
- `index.js`: Calculator microservice code.

## Verification

- Check pods: `kubectl get pods` (ensure no `ImagePullBackOff`).
- Check service: `kubectl get services` (note the external IP).

## Notes

- The access token expires after 60 minutes. If deployment fails with `ImagePullBackOff`, regenerate the token and recreate the `gcr-secret`.
- Logs are in the `./logs/` directory if you mount them locally.

## Screenshots

- VPC: `sit737-vpc` setup.
- GKE: `sit737-cluster` status.
- Pods: Running pods output.
- Service: External IP and test result.
- Permissions: Pods running after secret applied.

## Reflection

Setting up the VPC and `sit737-cluster` was straightforward, but limited IAM access forced me to use an access token. It worked well, though I had to time the token usage carefully. Seeing my app live on Kubernetes was a big win!
