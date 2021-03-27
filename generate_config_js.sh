#!/bin/sh -eu
if [ -z "${SCOPE:-}" ]; then
    SCOPE_JSON=undefined
else
    SCOPE_JSON=$(jq -n --arg scope '$SCOPE' '$scope')
fi
if [ -z "${LOGIN:-}" ]; then
    LOGIN_JSON=undefined
else
    LOGIN_JSON=$(jq -n --arg login '$LOGIN' '$login')
fi
if [ -z "${CLIENT:-}" ]; then
    CLIENT_JSON=undefined
else
    CLIENT_JSON=$(jq -n --arg client '$CLIENT' '$client')
fi
if [ -z "${URL:-}" ]; then
    URL_JSON=undefined
else
    URL_JSON=$(jq -n --arg url '$URL' '$url')
fi

cat <<EOF
window.REACT_APP_LOGIN=$LOGIN_JSON;
window.REACT_APP_CLIENT=$CLIENT_JSON;
window.REACT_APP_SCOPE=$SCOPE_JSON;
window.REACT_APP_URL=$URL_JSON;
EOF