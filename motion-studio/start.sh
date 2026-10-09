#!/usr/bin/env bash
cd "$(dirname "$0")" && exec claude --model claude-sonnet-5-5 --advisor claude-opus-5-5 "$@"
