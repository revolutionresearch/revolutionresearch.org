document.addEventListener('DOMContentLoaded', () => {
    function toggleCategoryExpansion(e) {
        e.preventDefault();

        this.closest('.category').classList.toggle('expanded');
    }

    const category_titles = document.querySelectorAll(
        '.wiki-articles-by-categories .category-title'
    );

    category_titles.forEach(category_title => {
        category_title.addEventListener('click', toggleCategoryExpansion)
    });
});
