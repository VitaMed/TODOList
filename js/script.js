var todoItems = {}
var currentAutoIncrementKey = 0

$('#openCreate').click(function(){
    
    $("#create-title").val("");
    $("#create-description").val("");
    $("#create-priority").val("High");

    $("#createModal").modal('show');
})

$("#create-cancel").click(function( event ){
    $("#createModal").modal('hide');
})

$("#edit-cancel").click(function(){
    $("#editModal").modal('hide');
})

$("#create-form").submit(function ( event ) {
    let data = $( this ).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    data['checked'] = false;

    let template = document.querySelector( "#card" );
    let clone = document.importNode(template.content, true);
    let cardHeader = clone.querySelector('span[name="card-header-text"]');
    cardHeader.textContent = data['title'];
    let cardBody = clone.querySelector('span[name="card-body-text"]');
    cardBody.textContent = data['description'];
    let priority = clone.querySelector(".priority");
    priority.textContent = data['priority'];
    let checkSquare = clone.querySelector(".fa-check-square");
    checkSquare.style.visibility = "hidden";
    let idSpan = clone.querySelector(".card-id");
    idSpan.textContent = currentAutoIncrementKey;
    data['id'] = currentAutoIncrementKey;
    currentAutoIncrementKey++;
    todoItems[data['id']] = (data);
    clone.querySelector(".card-div").id = `card-${data['id']}`;

    $( clone.querySelector(".done-button") ).click(function ( event ) {
        let header = $( this ).closest(".card-div").get(0);
        let checkSquare = header.querySelector(".fa-check-square");
        let id = parseInt(header.querySelector(".card-id").textContent);
        todoItems[id]['checked'] = true;
        checkSquare.style.visibility = "visible";
        check(data);
    })

    $( clone.querySelector(".delete-button") ).click(function ( event ) {
        let header = $( this ).closest(".card-div").get(0);
        let id = parseInt(header.querySelector(".card-id").textContent);
        delete todoItems[id];

        $( this ).closest(".card-div").remove();
    })

    $( clone.querySelector(".edit-button") ).click(function ( event ) {
        let header = $( this ).closest(".card-div").get(0);
        let id = parseInt(header.querySelector(".card-id").textContent);
        $("#edit-id").val(id);
        $("#edit-title").val(todoItems[id]['title']);
        $("#edit-description").val(todoItems[id]['description']);
        $("#edit-priority").val(todoItems[id]['priority']);

        $("#editModal").modal("show");
    })

    let todoList = document.getElementById("list");
    todoList.appendChild(clone);
    event.preventDefault();
    check(data);
    $("#createModal").modal("hide");
});


$("#edit-form").submit(function ( event ) {
    let data = $( this ).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
    data['checked'] = false;

    let id = `card-${data['id']}`;
    let card = document.getElementById(id);

    let cardHeader = card.querySelector('span[name="card-header-text"]');
    cardHeader.textContent = data['title'];
    let cardBody = card.querySelector('span[name="card-body-text"]');
    cardBody.textContent = data['description'];
    let priority = card.querySelector(".priority");
    priority.textContent = data['priority'];
    let checkSquare = card.querySelector(".fa-check-square");
    checkSquare.style.visibility = "hidden";

    todoItems[data['id']] = data;
    event.preventDefault();
    check(data);

    $("#editModal").modal("hide");
});
$('#search').click(function() {
    let title = document.getElementById('inputTitle').value;
    $.each(todoItems, function (index, value) {
        let id = `card-${value['id']}`;
        let card = document.getElementById(id);
        console.log(todoItems[value['id']]['title'].indexOf(title));
        if(todoItems[value['id']]['title'].indexOf(title)>=0)
            card.style.display = "inline-block";
        else
            card.style.display = "none";
    })
})
$('#statusCard').change(function() {
    $.each(todoItems, function (index, value) {
        let id = `card-${value['id']}`;
        let card = document.getElementById(id);
        choosePriority(value);
        if(card.style.display == "inline-block")
             chooseStatus(value);
    });
});

let chooseStatus = function(value){
    let id = `card-${value['id']}`;
    let card = document.getElementById(id);
    if ($('#statusCard option:selected').val() == 0)
        card.style.display = "inline-block";
    else if ($('#statusCard option:selected').val() == 1) {
        if (todoItems[value['id']]['checked'] == true) {
            card.style.display = "none";
        }
        else
            card.style.display = "inline-block";
    }
    else if ($('#statusCard option:selected').val() == 2) {
        if (todoItems[value['id']]['checked'] == true) {
            card.style.display = "inline-block";
        }
        else
            card.style.display = "none";
    }
}

$('#priorityCard').change(function() {
    $.each(todoItems, function (index, value) {
        let id = `card-${value['id']}`;
        let card = document.getElementById(id);
        chooseStatus(value);
        if(card.style.display == "inline-block")
            choosePriority(value);
    });
});
let check = function(value){
    $.each(todoItems, function (index, value) {
        let id = `card-${value['id']}`;
        let card = document.getElementById(id);
        chooseStatus(value);
        if(card.style.display == "inline-block")
            choosePriority(value);
    });
}

let choosePriority = function(value) {
    let id = `card-${value['id']}`;
    let card = document.getElementById(id);
    if ($('#priorityCard option:selected').val() == "all")
        card.style.display = "inline-block";
    else if ($('#priorityCard option:selected').val() == "high") {
        if (todoItems[value['id']]['priority'] == "High") {
            card.style.display = "inline-block";
        }
        else
            card.style.display = "none";
    }
    else if ($('#priorityCard option:selected').val() == "normal") {
        if (todoItems[value['id']]['priority'] == "Normal") {
            card.style.display = "inline-block";
        }
        else
            card.style.display = "none";
    }
    else if ($('#priorityCard option:selected').val() == "low") {
        if (todoItems[value['id']]['priority'] == "Low") {
            card.style.display = "inline-block";
        }
        else
            card.style.display = "none";
    }
}