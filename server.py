from flask import Flask, request, jsonify, Response
import requests

# Where the inventory engine lives
INVENTORY_BASE = "http://127.0.0.1:5050"

app = Flask(__name__)


@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "app": "MultistoreCICD",
        "message": "API gateway is running",
        "inventory_engine": INVENTORY_BASE,
    })


def _proxy_json(method: str, path: str):
    """
    Helper: forward JSON body and return JSON response.
    """
    url = INVENTORY_BASE + path

    try:
        if method == "GET":
            upstream = requests.get(url, params=request.args, timeout=5)
        elif method == "POST":
            upstream = requests.post(url, json=request.get_json(force=True), timeout=5)
        else:
            return jsonify({"error": f"Unsupported method {method}"}), 405
    except requests.RequestException as e:
        return jsonify({"error": "Inventory service unavailable", "details": str(e)}), 502

    return Response(
        response=upstream.content,
        status=upstream.status_code,
        mimetype=upstream.headers.get("Content-Type", "application/json"),
    )


# --------------------------
# Inventory proxy endpoints
# --------------------------

@app.route("/api/stock/adjust", methods=["POST"])
def stock_adjust():
    # POST /api/stock/adjust -> forwards to 5050/api/stock/adjust
    return _proxy_json("POST", "/api/stock/adjust")


@app.route("/api/stock/<store_id>/<sku>", methods=["GET"])
def stock_get(store_id: str, sku: str):
    # GET /api/stock/store-nyc/SKU123 -> forwards to 5050/api/stock/store-nyc/SKU123
    path = f"/api/stock/{store_id}/{sku}"
    return _proxy_json("GET", path)


@app.route("/api/stock/<sku>/snapshot", methods=["GET"])
def stock_snapshot(sku: str):
    # GET /api/stock/SKU123/snapshot -> forwards to 5050/api/stock/SKU123/snapshot
    path = f"/api/stock/{sku}/snapshot"
    return _proxy_json("GET", path)


@app.route("/debug/routes", methods=["GET"])
def debug_routes():
    # Show all routes this gateway knows about
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    return jsonify({"routes": routes})


if __name__ == "__main__":
    # Run this as the MultistoreCICD API gateway on port 5000
    app.run(host="127.0.0.1", port=5000, debug=True)

