let categories = [];
let childbtn = `<button class="btn btn-light showchild">show</button>`;
let btns = `
<div class="d-flex">
    <button class="btn btn-primary update" data-bs-toggle="modal" data-bs-target="#modalId">Update</button>
    <button class="btn btn-danger ms-2 delete">Delete</button>
</div>`;


$(document).ready(function () {


    let datatable = $("#category").DataTable({
        paging: true,
        searching: true,
        data: [],
        columns: [
            {
                data: null,
                defaultContent: childbtn
            },
            { data: "name" },
            { data: "description" },
            { data: "active" },
            { data: "new_cat" },
            {
                data: null,
                defaultContent: btns
            },
        ]
    });

    function submit(e) {
        e.preventDefault();

        $("#update").hide();
        $("submit").show();
        let isactive = $("#active").prop('checked');
        let new_cat = "old";
        let date = $("#date").val();
        let current_date = new Date();
        let c_date = new Date(date);

        if (current_date.getTime() < c_date.getTime() || $("#date").val() === "") {
            alert("Invalid Date");
        } else {

            let diff = (current_date.getTime() - c_date.getTime()) / 1000 / 60 / 60 / 24;

            if (diff < 7) {
                new_cat = "new";
            }

            let items = [];
            $("#item tbody tr").each(function () {


                let row = $(this).find(".form-control");

                let isactive = $(this).find(".iactive").prop('checked');
                let item = {
                    name: $(this).find(".iname").val(),
                    description: $(this).find(".idescription").val(),
                    type: $(this).find(".itype").val(),
                    price: $(this).find(".iprice").val(),
                    discount: $(this).find(".idiscount").val(),
                    gst: $(this).find(".igst").val(),
                    active: isactive ? true : false
                }
                items.push(item);
            });

            let category = {
                name: $("#name").val(),
                description: $("#description").val(),
                active: isactive ? "yes" : "no",
                new_cat: new_cat,
                date: date,
                items: items
            }
            categories.push(category);
            datatable.row.add(category).draw();

            $('input').val('');
            $('textarea').val('');
            $("#modalId").modal('hide');
        }
    }

    function showchild() {
        let tr = $(this).closest('tr');
        let row = datatable.row(tr);
        let index = row.index();

        let items = categories[index].items;

        let cnt = 0;
        let total_price = 0;
        let total_discounted_price = 0;

        let table = $(`<table class="table text-center table-responsive">
        <thead>
            <th>Number</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Discounted Price</th>
        </thead>
        <tbody>`);
        for (let index = 0; index < items.length; index++) {
            cnt++;

            let discounted_price = items[index].price - ((items[index].price * items[index].discount) / 100);
            total_price += items[index].price * 1.00;
            total_discounted_price += discounted_price;


            let tr = `<tr>
                <td>${cnt}</td>
                <td>${items[index].name}</td>
                <td>${items[index].type}</td>
                <td>${items[index].price}</td>
                <td>${items[index].discount}</td>
                <td>${discounted_price}</td>
            </tr>`;

            table.append(tr);
        }
        let footer = `<tfoot>
            <tr>
                <td class="text-center">Total</td>
                <td></td>
                <td></td>
                <td class="text-center">${total_price}</td>
                <td></td>
                <td class="text-center">${Math.round(total_discounted_price)}</td>
            </tr>
        </tfoot></tbody</table>`;
        table.append(footer);



        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('Shown');
        } else {
            row.child(table).show();
            tr.addClass('Shown');
        }
    }

    let count = 0;
    function addrow() {
        count++;
        if (count < 10) {
            let table = $("#item tbody");
            let tr = `<tr>
            <td><input type="text " class="form-control iname" required></td>
            <td><textarea cols="30" rows="1" cols="10"
                    class="form-control idescription"></textarea></td>
            <td><select class="form-control itype">
                    <option value="Veg" selected>Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Sea-Food">Sea-Food</option>
                    <option value="Dairy-Food">Dairy-Food</option>
                </select></td>
            <td>
                <input type="number" class="form-control iprice" min="1" required>
            </td>
            <td><input type="number" class="form-control idiscount" min="1" max="15"
                    required></td>
            <td><input type="number" class="form-control igst" min="0" required></td>
            <td>
                <div class="form-check">
                    <input class="form-check-input form-control iactive" type="checkbox"
                        value="" id="" />
                    <label class="form-check-label" for="">Active </label>
                </div>
            </td>
            <td><button type="button" class="btn btn-dark removerow">-</button></td>
        </tr>`;
            table.append(tr);
        }
    }

    function removerow() {
        if (count > 1) {
            $(this).closest('tr').remove();
            count--;
        }
    }

    function deletedata() {
        if (confirm("Are you want to delete data?")) {

            let tr = $(this).closest('tr');
            let row = datatable.row(tr);
            let index = row.index();
            categories.splice(index, 1);
            datatable.row(tr).remove().draw();
        }
    }

    let cat_index;
    function updatedata() {
        $("#update").show();
        $("#submit").hide();
        let index = $(this).closest('tr').index();
        category = categories[index];

        cat_index = index;
        $("#name").val(category.name);
        $("#description").val(category.description);
        $("#date").val(category.date);
        if (category.active === "yes") {
            $("#active").prop('checked', true);
        } else {
            $("#active").prop('checked', false);
        }

        $("#item tbody tr").remove();
        let items = category.items;

        for (let index = 0; index < items.length; index++) {
            addrow();
            count--;
            $(".iname").eq(index).val(items[index].name);
            $(".idescription").eq(index).val(items[index].description);
            $(".itype").eq(index).val(items[index].type).trigger('change');
            $(".iprice").eq(index).val(items[index].price);
            $(".idiscount").eq(index).val(items[index].discount);
            $(".igst").eq(index).val(items[index].gst);
            if (items[index].active) {
                $(".iactive").eq(index).prop('checked', true);
            } else {
                $(".iactive").eq(index).prop('checked', false);
            }
        }
    }

    function update(e) {
        e.preventDefault();


        let isactive = $("#active").prop('checked');
        let new_cat = "old";
        let date = $("#date").val();
        let current_date = new Date();
        let c_date = new Date(date);

        if (current_date.getTime() < c_date.getTime() || $("#date").val() === "") {
            alert("Invalid Date");
        } else {
            let diff = (current_date.getTime() - c_date.getTime()) / 1000 / 60 / 60 / 24;
            if (diff < 7) {
                new_cat = "new";
            }
            let items = [];
            $("#item tbody tr").each(function () {
                let isactive = $(this).find(".iactive").prop('checked');
                let item = {
                    name: $(this).find(".iname").val(),
                    description: $(this).find(".idescription").val(),
                    type: $(this).find(".itype").val(),
                    price: $(this).find(".iprice").val(),
                    discount: $(this).find(".idiscount").val(),
                    gst: $(this).find(".igst").val(),
                    active: isactive ? true : false
                }
                items.push(item);
            });

            let category = {
                name: $("#name").val(),
                description: $("#description").val(),
                active: isactive ? "yes" : "no",
                new_cat: new_cat,
                date: date,
                items: items
            }
            categories[cat_index] = category;
            datatable.row(cat_index).data(category).draw();
        }
        $('input').val('');
        $('textarea').val('');
        $("#modalId").modal('hide');

    }
    $("#update").on("click", update);

    $(document).on("click", ".update", updatedata);
    $(document).on("click", ".removerow", removerow);
    $(document).on("click", ".delete", deletedata);
    $("#addrow").on("click", addrow);
    $(document).on("click", ".showchild", showchild);
    $("#cat-form").on("submit", submit);
});