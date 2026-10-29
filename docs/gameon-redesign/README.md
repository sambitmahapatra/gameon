# GameOn website redesign

A responsive static website concept for the gaming social club. It is built with plain HTML, CSS and JavaScript; no build step is required.

## Run locally
Open `index.html` in a browser, or run a simple local server from this folder:

```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy to Vercel
1. Create a new Git repository and add `index.html` (and this README).
2. Import the repository into Vercel.
3. Choose **Other** as the framework preset, with no build command and `.` as the output directory.
4. Deploy.

To replace the existing `gameon-roan` deployment, you need access to its source repository / Vercel project. This package does not change the live deployment by itself.

## Important implementation notes
- The booking and event forms are functional enquiry flows: they prepare an email draft using `mailto:`. They do not confirm a booking, process payment, or query live availability.
- `hello@gameon.cafe`, pricing, hours and some package details are placeholders/illustrative. Update these before public launch.
- Photos are loaded from Unsplash and Google Fonts from Google Fonts, so internet access is needed for those assets.
- Membership and hourly prices are explicitly marked indicative and should be validated before being advertised as actual offers.
