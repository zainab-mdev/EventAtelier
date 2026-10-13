
const faq_items = document.querySelectorAll(".faq-item");
faq_items.forEach((item) => {
  const faq_checkbox = item.querySelector("input[type='checkbox']");
  faq_checkbox.addEventListener("change", function () {
    if (faq_checkbox.checked) {
      faq_items.forEach((other_item) => {
        const other_checkbox = other_item.querySelector("input[type='checkbox']");
        if (other_checkbox !== faq_checkbox) {
          other_checkbox.checked = false;
        }
      });
    }
  });
});