let categories = []
let btns = `
<button type="button" name="" id="" class="btn btn-primary edit" data-bs-toggle="modal" data-bs-target="#modalId">
    Edit
</button>
<button type="button" name="" id="" class="btn btn-danger delete">
    Delete
</button>`;

let childbtn = `<button type="button" name="" id="" class="btn btn-light showchild">
+
</button>`;

$(document).ready(function () {

    let datatable = $("#category").DataTable({
        searching: true,
        paging: true,
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
        $("#submit").show();
        let current_date = new Date();
        let date = new Date($("#date").val());
        let isactive = $("#active").prop('checked');

        let new_cat = "old";
        let diff = Math.round((current_date.getTime() - date.getTime()) / 1000 / 60 / 60  / 24 );
        if (diff < 7) {
            new_cat = "new";
        }
        if (current_date.getTime() < date.getTime() || $("#date").val() === "") {
            alert("Category Date is invalid");
        } else {


            let items = [];
            $("#item tbody tr").each(function () {
                let row = $(this).find('.form-control');

                let discount = row.eq(4).val();
                let price = row.eq(3).val();
                let isactive = $(this).find('.iactive').prop('checked');
                let active = isactive ? true : false;
                let dis_price = 0;
                if (active) {
                    dis_price = (price * discount) / 100;
                }

                let item = {
                    name: row.eq(0).val(),
                    description: row.eq(1).val(),
                    type: row.eq(2).val(),
                    price: row.eq(3).val(),
                    discount: row.eq(4).val(),
                    gst: row.eq(5).val(),
                    active: active,
                    discounted_price: price*1.00 - dis_price,
                };
                items.push(item);
            })

            let Category = {
                name: $("#name").val(),
                description: $("#description").val(),
                active: isactive ? "yes" : "no",
                date: $("#date").val(),
                new_cat: new_cat,
                items: items
            }
            categories.push(Category);
            datatable.row.add(Category).draw();
            $('input').val('');
            $('textarea').val('');
            $('#modalId').modal("hide");

        }
    }


    let count = 0;
    function addRow() {
        count++;
        let table = $("#item tbody");
        if (count < 10) {
            let tr = `<tr class="form-tr">
            <td scope="row">
                <div class="mb-3">

                    <input type="text" class="form-control iname"
                        aria-describedby="helpId" placeholder="" pattern="[a-z A-Z]+"
                        required />

                </div>
            </td>
            <td>
                <div class="mb-3">

                    <textarea class="form-control idescription" name="" id=""
                        rows="1" cols="10"></textarea>
                </div>
            </td>
            <td>
                <div class="mb-3">

                    <select class="form-select form-control itype"
                        name="" id="">
                        <option value="Veg" selected>Veg</option>
                        <option value="Non-veg">Non-veg</option>
                        <option value="Dairy Food">Dairy Food</option>
                        <option value="Sea Food">Sea Food</option>
                    </select>
                </div>
            </td>
            <td>
                <div class="mb-3">

                    <input type="number" class="form-control iprice" name="" id=""
                        aria-describedby="helpId" placeholder="" min="1" required/>

                </div>
            </td>
            <td>
                <div class="mb-3">

                    <input type="number" class="form-control idiscount" name="" id=""
                        aria-describedby="helpId" placeholder="" min="1" max="15" required />

                </div>
            </td>
            <td>
                <div class="mb-3">

                    <input type="number" class="form-control igst" name="" id=""
                        aria-describedby="helpId" placeholder="" min="0"required />

                </div>
            </td>
            <td>
                <div class="form-check">
                    <input class="form-check-input iactive" type="checkbox" value="yes"
                        id="" checked />
                </div>

            </td>
            <td><button type="button" class="btn btn-dark removeRow">-</button></td>
        </tr>`;
            table.append(tr);
        }

    }

    function removeRow() {
        if (count > 0) {
            $(this).closest('tr').remove();
            count--;
        }
    }


    function showchild() {
        let tr = $(this).closest('tr');
        let row = datatable.row(tr);
        let index = row.index();

        let items = categories[index].items;
        let table = $(`<table class="table table-primary table-bordered text-center">`)
        table.append(`<thead>
            <tr>
                <th scope="col">Number</th>
                <th scope="col">Item Name</th>
                <th scope="col">Food Type</th>
                <th scope="col">Price</th>
                <th scope="col">Discount</th>
                <th scope="col">Discounted Price</th>
            </tr>
        </thead>
        <tbody>`);



        let total = 0;
        let discounted_price = 0;
        let cnt = 1;
        for (let index = 0; index < items.length; index++) {
            total += items[index].price * 1.00;
            discounted_price += items[index].discounted_price;

            let tr = `
            <tr>
                <td>${cnt++}</td>
                <td>${items[index].name}</td>
                <td>${items[index].type}</td>
                <td>${items[index].price}</td>
                <td>${items[index].discount}%</td>
                <td>${items[index].discounted_price}</td>
            </tr>`
            table.append(tr);
        }
        table.append(`</tbody>`);

        let footer = `<tfoot>
        <tr>
                    <td class="text-center">Total</td>
                    <td></td>
                    <td></td>
                    <td  class="text-center">${total}</td>
                    <td></td>
                    <td  class="text-center">${discounted_price}</td>
                    </tr>
        </tfoot></table>`;
        table.append(footer);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass("Shown");
        } else {
            row.child(table).show();
            tr.addClass("Shown");
        }

    }



    function deletedata() {
        let tr = $(this).closest('tr');
        let index = tr.index();
        if (confirm("Are You sure for Delete Data?")) {
            categories.splice(index, 1);
            datatable.rows(tr).remove().draw();
        }
    }

    let cat_index = 0;
    function update() {
        $("#update").show();
        $("#submit").hide();
        let tr = $(this).closest('tr');
        let index = tr.index();
        cat_index = index;

        let category = categories[index];



        $("#name").val(category.name);
        $("#description").val(category.description);
        if (category.active === "yes") {
            $("#active").prop('checked', true);
        }
        console.log(category.date);
        $("#date").val(category.date);//date

        let item = category.items;

        table = $("#item tbody tr").remove();
        for (let index = 0; index < item.length; index++) {
            addRow();
            count--;
            
            $(".iname").eq(index).val(item[index].name);
            $(".idescription").eq(index).val(item[index].description);
            $(".itype").eq(index).val(item[index].type);
            $(".iprice").eq(index).val(item[index].price);
            $(".idiscount").eq(index).val(item[index].discount);
            $(".igst").eq(index).val(item[index].gst);

            if (item[index].active) {
                $(".iactive").eq(index).prop('checked', true);
            } else {
                $(".iactive").eq(index).prop('checked', false);
            }
        }
    }

    function updatedata(e) {
        e.preventDefault();
        let current_date = new Date();
        let date = new Date($("#date").val());
        let isactive = $("#active").prop('checked');

        let new_cat ;
        let diff = Math.round((current_date.getTime() - date.getTime()) / 1000 / 60 / 60  / 24 );
        if (diff < 7) {
            new_cat = "new";
        }else{
            new_cat= 'Old';
        }

        if (current_date.getTime() < date.getTime()) {
            alert("Category Date is invalid");
        } else {
            let items = [];
            $("#item tbody tr").each(function () {
                let row = $(this).find('.form-control');

                let price = row.eq(3).val();
                let discount = row.eq(4).val();
                let isactive = $(this).find('iactive').prop('checked');
                let active = isactive ? true : false;
                let dis_price = 0;
                if (active) {
                    dis_price = (price * discount) / 100;
                }

                let item = {
                    name: row.eq(0).val(),
                    description: row.eq(1).val(),
                    type: row.eq(2).val(),
                    price: row.eq(3).val(),
                    discount: row.eq(4).val(),
                    gst: row.eq(5).val(),
                    active: active,
                    discounted_price: price - dis_price,
                };
                items.push(item);
            })

            let Category = {
                name: $("#name").val(),
                description: $("#description").val(),
                active: isactive ? "yes" : "no",
                date: date,
                new_cat: new_cat,
                items: items
            }
            categories[cat_index] = Category;
            datatable.row(cat_index).data(Category).draw();
            datatable.row(cat_index).child.hide();
            $('#modalId').modal("hide");
            $('input').val('');
            $('textarea').val('');
            $("#update").hide();
            $("#submit").show();
        }
    }
    $(document).on('click', "#update", updatedata);
    $(document).on('click', ".delete", deletedata);
    $(document).on('click', ".edit", update);
    $(document).on('click', ".showchild", showchild);
    $(document).on('click', ".removeRow", removeRow);
    $("#addRow").on('click', addRow);
    // $("#submit").on('click', submit);
    document.querySelector('.foodForm').addEventListener('submit', submit);
});