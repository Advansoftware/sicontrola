#!/bin/sh

npx prisma generate
npx prisma db seed

npm run start:dev
