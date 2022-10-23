async function addItemToCart(id, quantity = 1) {
  $.ajax({
    url: "/cart",
    method: "POST",
    data: { id, quantity },
    success: (result) => {
      $("#cart-badge").html(result.totalQuantity);
    },
  });
}

function updateCart(id, quantity) {
  if (parseInt(quantity) === 0) {
    const agree = confirm("Are you sure to delete this item");
    if (agree) removeItemCart(id);
  } else {
    updateItemCart(id, quantity);
  }
}

function updateItemCart(id, quantity) {
  $.ajax({
    url: "/cart",
    method: "PUT",
    data: { id, quantity },
    success: (result) => {
      console.log({ result });
      $("#cart-badge").html(result.totalQuantity);
      $("#total-price").html(result.totalPrice);
      $(`#price-item${id}`).html(result.item.price);
    },
  });
}

function removeItemCart(id) {
  $.ajax({
    url: "/cart",
    method: "DELETE",
    data: { id },
    success: (result) => {
      $("#cart-badge").html(result.totalQuantity);
      $("#total-price").html(result.totalPrice);
      if (result.totalQuantity === 0) {
        $(`#container-cart-table`).html(`
        <div class="alert alert-info text-center">
            Empty Cart !!!
        </div>`);
      } else {
        $(`#body-item${id}`).remove();
      }
    },
  });
}

function clearCart() {
  if (confirm("Are you sure to clear cart")) {
    $.ajax({
      url: "/cart/all",
      method: "DELETE",
      data: {},
      success: () => {
        $("#cart-badge").html(0);
        $(`#container-cart-table`).html(`
          <div class="alert alert-info text-center">
              Empty Cart !!!
          </div>`);
      },
    });
  }
}
