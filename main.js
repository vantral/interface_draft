/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active')
        event.relatedTarget.classList.add('dragging')
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target
        
        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
        // draggableElement.textContent = 'Dragged in'

    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
        // event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
        // event.relatedTarget.textContent = 'Dropped'

        console.log(event)
        const draggableElements = [...event.target.querySelectorAll('.drag-drop:not(.dragging)')]
        left = draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = event._interaction.coords.cur.client.x - box.left - box.width / 3
            // console.log(offset)
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
        // remove active dropzone feedback
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('dragging')
        document.querySelectorAll('.group').forEach(group => {
            if (group.textContent == "") {
                group.remove()
            }
        })
    }
})
  
interact('.drag-drop').draggable({
    inertia: true,
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