FROM node:22 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
RUN apt update && apt install ffmpeg -y
COPY --from=base /app /app
COPY --from=prod-deps /app/node_modules /app/node_modules
CMD [ "node", "src/index.js" ]
