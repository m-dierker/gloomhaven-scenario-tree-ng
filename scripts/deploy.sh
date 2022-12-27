#!/usr/bin/env bash

ng build -c production
firebase deploy --only hosting --project=mdierker-gh-scenario-viewer