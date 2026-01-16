from playwright.sync_api import sync_playwright

def verify_forms():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Base URL from preview (port 4173)
        base_url = "http://localhost:4173"

        try:
            # 1. Verify Superforms (fixed critical bugs)
            print("Verifying Superforms...")
            page.goto(f"{base_url}/superforms")
            page.screenshot(path="verification/superforms_initial.png")

            # Interact with Edit User form - Switch Region
            page.select_option('select[name="region"]', 'US')
            # Wait for US fields
            page.wait_for_selector('input[name="us.zipPlus4"]')
            page.screenshot(path="verification/superforms_us_region.png")

            # Switch back to EU
            page.select_option('select[name="region"]', 'EU')
            page.wait_for_selector('input[name="eu.vatId"]')
            # Check GDPR consent field exists
            page.wait_for_selector('input[name="eu.gdprConsent"]')
            page.screenshot(path="verification/superforms_eu_region.png")

            # 2. Verify Felte (partial fix)
            print("Verifying Felte...")
            page.goto(f"{base_url}/felte")
            page.screenshot(path="verification/felte_initial.png")

            # Switch Region to US
            # Note: Felte uses 'region' select
            page.select_option('select[name="region"]', 'US')
            page.wait_for_selector('input[name="us.zipPlus4"]')
            page.screenshot(path="verification/felte_us_region.png")

            # 3. Verify Formsnap (no visual changes expected but good to check)
            print("Verifying Formsnap...")
            page.goto(f"{base_url}/formsnap")
            page.screenshot(path="verification/formsnap_initial.png")

            print("Verification complete. Screenshots saved.")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_forms()
