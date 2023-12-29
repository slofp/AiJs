#!/bin/bash

CURRENT=$(curl -s "https://api.github.com/repos/${REPO}/tags" | jq ".[0] | .name" | tr -d '"')
TAG=$(cat package.json | jq ".version" | tr -d '"')
if [ "$CURRENT" == "$TAG" ] ; then
  exit 255
fi
echo "add tag: ${TAG}"

curl -s -X POST "https://api.github.com/repos/${REPO}/git/refs" -H "Authorization: token $GITHUB_TOKEN" -d @- << EOS
{
  "ref": "refs/tags/${TAG}",
  "sha": "${COMMIT}"
}
EOS
