//http://127.0.0.1:8000
//http://api-lista.herokuapp.com/api/
const BASE_URL = "http://api-lista.herokuapp.com/api/";
const BASE_IMAGE = "http://api-lista.herokuapp.com/storage/products/";
$(function() {
    $("#edit").hide();
    $("#add").hide();
    $("#product-search").hide();
    $("#detailProduct").hide();
    $("#editProduct").hide();
    $.ajax({
        method: "GET",
        url: BASE_URL + "lists",
        success: function(response) {
            response.lists.forEach(element => {
                var newRow = $("<tr>");
                var list = "";
                list += "<td><a href=''>" + element.name + "</a></td>";
                list += "<td>" + element.category + "</td>";
                list +=
                    "<td>" +
                    element.created_at
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/") +
                    "</td>";
                list +=
                    '<td><button class="btn btn-secondary" onclick="showDetails(' +
                    element.id +
                    ')">Detalhes</button>';
                list +=
                    '<button onclick="showEdit(' +
                    element.id +
                    ')" class="btn btn-primary mx-4" id="idValEdit" >Editar</button>';
                list +=
                    '<button onclick="delList(' +
                    element.id +
                    ')" class="btn btn-danger">Apagar</button></td>';

                newRow.append(list);
                $("#list-table").append(newRow);
            });
        }
    });

    url = window.location.search.replace("?", "");
    url = url.replace("id=", "");
    details(url);

    $.ajax({
        type: "GET",
        url: BASE_URL + "lists/" + url,
        success: function(response) {
            response.data[0].list_product.forEach(element => {
                let newRow = $("<tr>");
                let list = "";
                list +=
                    "<td><img height='75' src='" +
                    BASE_IMAGE +
                    "" +
                    element.image +
                    "'</td>";
                list += "<td>" + element.name + "</td>";
                list += "<td>" + element.description + "</td>";
                list += "<td>R$ " + element.price + "</td>";
                list +=
                    '<td><button class="btn btn-secondary" onclick="detailProduct(' +
                    element.id +
                    ')">Detalhes</button>';
                list +=
                    '<button onclick="showEditProduct(' +
                    element.id +
                    ')" class="btn btn-primary mx-4" id="idValEdit" >Editar</button>';
                list +=
                    '<button onclick="deleteProduct(' +
                    element.id +
                    ')" class="btn btn-danger">Apagar</button></td>';

                newRow.append(list);
                $("#product-table").append(newRow);
            });
        }
    });

    $(document).on("submit", "#form-product", function(event) {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: BASE_URL + "list_products/store",
            dataType: "json",
            data: new FormData(this),
            processData: false,
            contentType: false,
            dataType: "json",
            success: function(response) {
                alert(response.msg);
                reload();
            }
        });
    });

    $(document).on("submit", "#form-product-edit", function(event) {
        event.preventDefault();
        let id = $("#id_product").val();
        $.ajax({
            method: "PUT",
            url: BASE_URL + "list_products/update/" + id,
            data: {
                name: $("#name").val(),
                description: $("#description").val(),
                price: $("#price").val()
            },
            dataType: "json",
            success: function(response) {
                alert(response.msg);
                reload();
            }
        });
    });
});

function formLists() {
    $("#add").show();
    $("#lists").hide();
}

function addList() {
    $.ajax({
        method: "POST",
        url: BASE_URL + "lists",
        data: {
            name: $("#name").val(),
            category: $("#category").val()
        },
        dataType: "json",
        success: function(response) {
            alert(response.msg);
            window.location.reload();
        }
    });
}

function showEdit(id) {
    $.ajax({
        method: "GET",
        url: BASE_URL + "lists/" + id,
        dataType: "json",
        success: function(response) {
            $("#add").hide();

            $("#id").val(response.data[0].id);
            $("#nameE").val(response.data[0].name);
            $("#categoryE").val(response.data[0].category);

            $("#edit").show();
        }
    });
}

function editList() {
    $.ajax({
        method: "PUT",
        url: BASE_URL + "lists/update/" + $("#id").val(),
        data: {
            name: $("#nameE").val(),
            category: $("#categoryE").val()
        },
        dataType: "json",
        success: function(response) {
            alert(response.msg);
            window.location.reload();
        }
    });
}

function delList(id) {
    $.ajax({
        method: "DELETE",
        url: BASE_URL + "lists/destroy/" + id,
        dataType: "json",
        success: function(response) {
            alert(response.msg);
            window.location.reload();
        }
    });
}

function showDetails(id) {
    window.location.href = "list-products.html?id=" + id;
}

function details(id) {
    $.ajax({
        method: "GET",
        url: BASE_URL + "lists/" + id,
        dataType: "json",
        success: function(response) {
            $("#nameLits").html("<h3>" + response.data[0].name + " </h3>");
            $("#categoryList").html("Categoria: " + response.data[0].category);
            $("#createdAtList").html(
                "Data de criação: " + response.data[0].created_at
            );
            $("#id_list").val(response.data[0].id);
        }
    });
}

function detailProduct(id) {
    $.ajax({
        method: "GET",
        url: BASE_URL + "list_products/show/" + id,
        dataType: "json",
        success: function(response) {
            console.log(response.list_product.image);
            $("#products").hide();
            $("#detailProduct").show();
            $("#image-product").html(
                "<img height='200' src='" +
                BASE_IMAGE +
                "" +
                response.list_product.image +
                "'>"
            );
            let text = "<h1>" + response.list_product.name + "</h1>";
            text +=
                "<p>Descrição: " +
                response.list_product.description +
                " <br> Preço: R$ " +
                response.list_product.price +
                "</p> <br><br> <button onclick='reload()' class='btn btn-secondary'>Voltar aos produtos</button>";
            $("#infos-product").html(text);
        }
    });
}

function showEditProduct(id) {
    $.ajax({
        method: "GET",
        url: BASE_URL + "list_products/show/" + id,
        dataType: "json",
        success: function(response) {
            $("#list-product-details").hide();
            $("#products").hide();
            $("#editProduct").show();

            $("#id_product").val(response.list_product.id);
            $("#name").val(response.list_product.name);
            $("#description").val(response.list_product.description);
            $("#price").val(response.list_product.price);
        }
    });
}

function deleteProduct(id) {
    $.ajax({
        method: "DELETE",
        url: BASE_URL + "list_products/destroy/" + id,
        success: function(response) {
            alert(response.msg);
            reload();
        }
    });
}

function searchProduct() {
    let string = $("#search").val();
    let id = $("#id_list").val();
    $.ajax({
        metho: "GET",
        url: BASE_URL + "list_products/search/" + string,
        data: { id: id },
        dataType: "json",
        success: function(response) {
            $("#products").hide();
            $("#product-search").show();

            //Montando dados
            response.list_product.forEach(element => {
                let newRow = $("<tr>");
                let list = "";
                list +=
                    "<td><img height='75' src='" +
                    BASE_IMAGE +
                    "" +
                    element.image +
                    "'></td>";
                list += "<td>" + element.name + "</td>";
                list += "<td>" + element.description + "</td>";
                list += "<td>R$ " + element.price + "</td>";
                list +=
                    '<td><button class="btn btn-secondary" onclick="detailProduct(' +
                    element.id +
                    ')">Detalhes</button>';
                list +=
                    '<button onclick="showEditProduct(' +
                    element.id +
                    ')" class="btn btn-primary mx-4" id="idValEdit" >Editar</button>';
                list +=
                    '<button onclick="deleteProduct(' +
                    element.id +
                    ')" class="btn btn-danger">Apagar</button></td>';

                newRow.append(list);
                $("#product-table-search").append(newRow);
            });
        }
    });
}

function reload() {
    window.location.reload();
}