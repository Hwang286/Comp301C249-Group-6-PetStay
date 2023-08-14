(function () {
    const deleteStoreBtns = document.querySelectorAll('.btn-delete-store');
    const printBtn = document.querySelector('#print-btn');
    deleteStoreBtns.forEach(deleteStoreBtn => {
        deleteStoreBtn.addEventListener('click', (e) => {
            if (!confirm("Are you sure to delete this store !")) {
                e.preventDefault();
                window.location.assign('/store-list');
            }
        });
    });
    printBtn.addEventListener('click', function () {
        printBtn.style.display = 'none';
        window.print();
        printBtn.style.display = 'block';
    });
}());
