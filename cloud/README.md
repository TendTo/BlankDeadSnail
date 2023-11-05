## How to run this locally

This guide shows how to run `hello_http` target locally.
To test with `hello_cloud_event`, change the target accordingly in Dockerfile.

Build the Docker image:

```commandline
docker build -t decorator_example .
```

Run the image and bind the correct ports:

```commandline
docker run --rm -p 8080:8080 -e PORT=8080 decorator_example
```

Send requests to this function using `curl` from another terminal window:

```sh
curl localhost:8080
# Output: Hello world!
```

```shell
# Deploy
gcloud functions deploy FUNCTION_NAME  --gen2 --region=europe-west2 --entry-point main --runtime py311 --trigger-http --allow-unauthenticated  --env-vars-file .env.yaml

gcloud functions deploy FUNCTION_NAME --update-build-env-vars FOO=bar
gcloud functions deploy FUNCTION_NAME --update-build-env-vars FOO=bar,BAZ=boo
gcloud functions deploy FUNCTION_NAME --remove-build-env-vars FOO,BAZ
gcloud functions deploy FUNCTION_NAME --clear-build-env-vars
```

## Public endpoint

[GCloud endpoint](https://europe-west2-durhack-404022.cloudfunctions.net/ping)
[GCloud endpoint](https://europe-west2-durhack-404022.cloudfunctions.net/product)

## Keys

### API key

afbc17299ed198bef0d4c7f450fd4692

### API Read Access Token

eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmJjMTcyOTllZDE5OGJlZjBkNGM3ZjQ1MGZkNDY5MiIsInN1YiI6IjY1NDZmNDY1ZDhjYzRhMDBhZDIzNGNhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bpP5IG8bLq2Co592I_QpZUpCAOaRlhzLXYVltip1MSM
