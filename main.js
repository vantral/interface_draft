/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.5,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        console.log('ondropactivate')
        event.target.classList.add('drop-active')
        event.relatedTarget.classList.add('dragging')
    },
    ondragenter: function (event) {
        console.log('ondragenter')
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target
        
        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
        // draggableElement.textContent = 'Dragged in'

    },
    ondragleave: function (event) {
        console.log('ondragleave')
        // remove the drop feedback style
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
        // event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
        // event.relatedTarget.textContent = 'Dropped'
        console.log('ondrop')
        const draggableElements = [...event.target.querySelectorAll('.drag-drop:not(.dragging)')]
        left = draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = event._interaction.coords.cur.client.x - box.left - box.width / 3
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
        if (left == null || event.target.classList.contains('group')) {
                console.log("APPEND")
                event.target.appendChild(event.relatedTarget)
            } else {
                console.log("INSERT")
                // console.log(left, event.relatedTarget, event.target)
                event.target.insertBefore(event.relatedTarget, left.parentElement)
            }

        // event.currentTarget.appendChild(event.relatedTarget)
        event.relatedTarget.style.transform = "none"
        event.relatedTarget.setAttribute('data-x', 0)
        event.relatedTarget.setAttribute('data-y', 0)
        if (!event.target.classList.contains('group')){
            $('.dragging').wrap("<div class='group dropzone'></div>")
        }
    },
    ondropdeactivate: function (event) {
        box = event.relatedTarget.getBoundingClientRect()
        if (
            !event.relatedTarget.parentElement.classList.contains('group') ||
            box.bottom > event._interaction.coords.cur.client.y || box.top < event._interaction.coords.cur.client.y
        ) {
            event.relatedTarget.style.transform = 'translate(0px, 0px)'
            event.relatedTarget.setAttribute('data-x', 0)
            event.relatedTarget.setAttribute('data-y', 0)
            if (event.relatedTarget.parentElement.classList.contains('group')) {
                event.relatedTarget.classList.add('can-drop')
            }
        }
        // remove active dropzone feedback
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('dragging')
        // document.getElementById('inner-dropzone').style.height = "fit-content"
    }
})
  
interact('.drag-drop').draggable({
    onstart: function (event) {
        console.log('onstart')
        var tiles = document.querySelectorAll('.dropzone .drag-drop')
        tiles.forEach(tile => {
            if (tile.getAttribute('data-x') == 0){
                tile.setAttribute('data-x', "-" + document.querySelector('#inner-dropzone').scrollLeft)
            }
        })
        let target = event.target
        let position = target.getBoundingClientRect()
        target.style.position = "absolute"
        target.style.top = position.top + "px"
    },
    onend: function (event) {
        let target = event.target
        target.style.position = "relative"
        target.style.top = "auto"
        
        

        y = event._interaction.coords.cur.client.y
        dropzone = document.querySelector('#inner-dropzone')
        if (y > dropzone.getBoundingClientRect().bottom) {
            target.classList.remove('can-drop')
            document.getElementById('start').appendChild(target)
        }
        document.querySelectorAll('.group').forEach(group => {
            if (group.textContent == "") {
                group.remove()
            }
        })

        var tiles = document.querySelectorAll('.dropzone .drag-drop')
        tiles.forEach(tile => {
            tile.setAttribute('data-x', 0)
        })
        // console.log(event)
    },
    inertia: false,
    modifiers: [
    interact.modifiers.restrictRect({
        endOnly: true
    })
    ],
    // autoScroll: true,
    // dragMoveListener from the dragging demo above
    listeners: { move: dragMoveListener }
})


function dragMoveListener (event) {
    console.log('movelistener')
    var target = event.target
    
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
    
}