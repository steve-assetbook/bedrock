#!/bin/bash -xe
export PORT="${PORT:-8000}"
exec honcho start -f docker/Procfile
