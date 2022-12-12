# Book Site

This repo contains code for a website focused on books I have read
and is an excuse to learn some React.

## Contributing

You don't contribute unless you are me. Here are reminders for me.

### Pre-requisites

To develop this site, need to have `npm` installed and `node` version 18.
The package was creaed with `npx create-react-app`.

We also use python 3.10 to develop the python script which manages
our database (a json file) of books. To start doing python stuff,
make sure you use a virtual environment via

```bash
cd python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
```

## Run the website

To run the website:

```bash
cd web
npm start
```
