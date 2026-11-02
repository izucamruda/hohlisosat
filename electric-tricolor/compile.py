import os
import re

def build_site():
    print("🚀 Сборка Энциклопедии Электротехнического Безумия...")
    
    base_template_path = os.path.join("src", "base_template.html")
    core_js_path = os.path.join("src", "main_core.js")
    sims_dir = os.path.join("src", "simulations")
    output_dir = "docs"
    output_file = os.path.join(output_dir, "index.html")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    if not os.path.exists(base_template_path):
        print(f"❌ Ошибка: Нет шаблона {base_template_path}")
        return

    with open(base_template_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    core_js = ""
    if os.path.exists(core_js_path):
        with open(core_js_path, "r", encoding="utf-8") as f:
            core_js = f.read()

    simulations_js = ""
    if os.path.exists(sims_dir):
        # Фильтруем JS файлы
        sim_files = [f for f in os.listdir(sims_dir) if f.endswith(".js")]
        
        # Умная сортировка, чтобы "10_" шло после "9_", а не после "1_"
        sim_files.sort(key=lambda var: [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', var)])
        
        for filename in sim_files:
            with open(os.path.join(sims_dir, filename), "r", encoding="utf-8") as f:
                simulations_js += f"\n\n/* = {filename} = */\n" + f.read()
            print(f"📦 Сшит модуль: {filename}")

    compiled_js = f"{core_js}\n\n{simulations_js}"
    
    # Инжектим JS в HTML
    html_content = html_content.replace("<!-- {{COMPILED_JAVASCRIPT}} -->", f"<script>{compiled_js}</script>")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"🏁 Готово! Сайт собран в: {output_file}")

if __name__ == "__main__":
    build_site()
