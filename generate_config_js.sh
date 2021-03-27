#!/bin/sh -eu
if [ -z "${SCOPE:-}" ]; then
    SCOPE_VAL=undefined
else
    SCOPE_VAL=$SCOPE
fi
if [ -z "${LOGIN:-}" ]; then
    LOGIN_VAL=undefined
else
    LOGIN_VAL=$LOGIN
fi
if [ -z "${CLIENT:-}" ]; then
    CLIENT_VAL=undefined
else
    CLIENT_VAL=$CLIENT
fi
if [ -z "${URL:-}" ]; then
    URL_VAL=undefined
else
    URL_VAL=$URL
fi


cat <<EOF
window.REACT_APP_LOGIN='$LOGIN_VAL';
window.REACT_APP_CLIENT='$CLIENT_VAL';
window.REACT_APP_SCOPE='$SCOPE_VAL';
window.REACT_APP_URL='$URL_VAL';
EOF