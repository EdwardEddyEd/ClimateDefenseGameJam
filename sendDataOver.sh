#!/bin/bash
# Send website over
tar -czvf climateDefense.tar.gz index.html js/ css/ res/
sendlitdart climateDefense.tar.gz
rm climateDefense.tar.gz