function hideItems(...items) {
    items.forEach(function (item, index) {
        item.visible = false;
    });
}

function showItems(...items) {
    items.forEach(function (item, index) {
        item.visible = true;
    });
}