# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Motion Design Studio

- Start: `./start.sh` (or `start.ps1`) runs `claude --model claude-sonnet-5-5 --advisor claude-opus-5-5`, then paste: `Read STUDIO_STATE.md and CLAUDE.md. Continue the studio setup and first job.`
- Preview: `npx remotion studio`
- Render: `npx remotion render <CompositionId> out/<name>.mp4 --codec=h264 --pixel-format=yuv420p --audio-codec=aac`
- Example prompts: "Make a 15 s launch video for <product>", "Revise demo-001: <change>", "Find clients for SaaS video work".
