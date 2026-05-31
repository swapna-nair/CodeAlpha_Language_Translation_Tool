import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto('http://localhost:8000')
        
        # Verify page title
        title = await page.title()
        assert title == "Language Translation Tool"
        
        # Type in the source language box
        await page.fill('.from-text', 'Hello world')
        
        # Select English to Spanish
        await page.select_option('select.from-lang', 'en-GB')
        await page.select_option('select.to-lang', 'es-ES')
        
        # Click Translate button
        await page.click('button.translate-btn')
        
        # Wait for translation to appear (placeholder changes back to Translation or error)
        # Assuming successful translation returns 'Hola mundo' or similar
        try:
            # Wait a bit for the API call
            await asyncio.sleep(2)
            
            translated_text = await page.input_value('.to-text')
            print(f"Translated text: {translated_text}")
            # Assert it's not empty, as external API might return slight variations
            assert len(translated_text) > 0
            
            # Take a screenshot
            await page.screenshot(path='screenshot.png')
            print("Tests passed, screenshot saved.")
        except Exception as e:
            print(f"Test failed: {e}")
        
        await browser.close()

asyncio.run(run())
