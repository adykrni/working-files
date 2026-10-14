# KLM Holidays — Case Study

A standalone Next.js case study page for the KLM Holidays design system project.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Geist](https://vercel.com/font) (Vercel font package)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/klm](http://localhost:3000/klm) to view the case study.

## Project structure

- `src/app/klm/page.tsx` — Case study page with all sections from the Figma design
- `src/components/OffersDemo.tsx` — Interactive Offers component configurator
- `src/components/OffersBlock.tsx` — Configurable Offers UI block

## Interactive demo

The **Give it a try** section includes a fully interactive Offers component. Users can toggle:

- **Package tier** — Economy / Business
- **Layout** — Full width / Half width
- **Partner logos** — On / Off

## Build

```bash
npm run build
npm start
```
