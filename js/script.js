window.onload = function () {
	var task = document.getElementById('task'),
        toDoList = JSON.parse(localStorage.getItem('list')) || [],
    	tplContent = document.querySelector('template').content,
        p = tplContent.querySelector('p'),
        li = tplContent.querySelector('li'),
        ul = document.getElementById('holder');

	function renderExistTasks (listItemData) {
		var clonedNode = tplContent.cloneNode(true);

		clonedNode.querySelector('p').textContent = listItemData.description;
		clonedNode.querySelector('input[type=checkbox]').checked = listItemData.isDone;
		clonedNode.querySelector('li').setAttribute('data-id', listItemData.id);
		clonedNode.querySelector('input[type=number]').value = listItemData.priority;

		holder.appendChild(clonedNode);
	}

	toDoList.forEach(renderExistTasks);

    function addTask () {
        var objNew = {
			isDone: false,
			priority: 1,
			description: task.value,
			id: toDoList.length
        };

		toDoList.push(objNew);
		localStorage.setItem('list', JSON.stringify(toDoList));

		p.textContent = task.value;
		li.setAttribute('data-id', objNew.id);
		document.querySelector('#holder').appendChild(tplContent.cloneNode(true));

    }

    ul.onclick = function(event) {
        var target = event.target;

        if (target.tagName === 'BUTTON') {
			if (target.className === 'deleteTask') {
				deleteTask(target);
			}
			if (target.className === 'editTask') {
				editTask(target);
			}
		}
    };

	ul.addEventListener('change', function (event) {
		var parentNode;

		if (event.target.type === 'number') { //input.hide, input[checkbox], input[number]
			parentNode = event.target.parentNode;
			toDoList[parentNode.getAttribute('data-id')].priority = parseInt(event.target.value, 10);
			toDoList.sort(function (a, b) {
				return a.priority - b.priority;
			});
			localStorage.setItem('list', JSON.stringify(toDoList));
			toDoList.forEach(function (dataItem, index, list) {
				var li = this.children[index],
					unboundElement,
					neededIndex;

				if (li.getAttribute('data-id') !== dataItem.id) {
					unboundElement = this.removeChild(li);
					list.forEach(function (element, index) {
						if (element.id == li.getAttribute('data-id')) {
							neededIndex = index;
						}
					});
					this.querySelector('li[data-id=' + list[neededIndex - 1].id + ']').insertAfter(unboundElement);
				}

			}, this);
		}

	}, false);

    function deleteTask (node) {
        ul.removeChild(node.parentNode);
        toDoList.splice(node.parentNode.getAttribute('data-id'), 1);
        localStorage.setItem('list', JSON.stringify(toDoList));
    }

    function editTask (node) {
        var no = node.previousElementSibling;

		no.classList.remove('hide');

	    p = node.parentNode.querySelector('p');
		no.value = p.textContent;
		document.ondblclick = function () {
			p.textContent = no.value;
			toDoList[node.parentNode.getAttribute('data-id')].description = no.value;
			localStorage.setItem('list', JSON.stringify(toDoList));
			no.classList.add('hide');
	   };
	}


    document.getElementById('add').addEventListener('click', addTask);
};
