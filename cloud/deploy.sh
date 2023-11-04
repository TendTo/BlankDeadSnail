endpoint=$1

if [ -z "$endpoint" ]
then
    echo "Please provide the enpoint name"
    exit 1
fi

gcloud functions deploy "$endpoint" \
 --gen2 \
 --region=europe-west2 \
 --runtime=python311 \
 --source=src/$endpoint \
 --entry-point=main \
 --env-vars-file .env.yaml \
 --trigger-http \
 --allow-unauthenticated