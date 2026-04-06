#!/bin/sh

npx prisma generate
npx ts-node --transpile-only -r tsconfig-paths/register prisma/seed.ts

npm run start:dev
