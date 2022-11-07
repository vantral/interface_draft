var draggables = document.querySelectorAll('.draggable')
var containers = document.querySelectorAll('.drag')



draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        containers = document.querySelectorAll('.drag')

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                
                document.querySelectorAll('.group').forEach(group => {
                    if (group.textContent == "СЮДА"){
                        group.remove()
                    }
                })
        
                e.preventDefault()
                const afterElement = getDragAfterElement(container, e.clientX, e.clientY)
                const draggable = document.querySelector('.dragging')
                if (afterElement == null || container.classList.contains('group')) {
                    container.appendChild(draggable)
                } else {
                    if (afterElement.parentElement == container)
                     {container.insertBefore(draggable, afterElement)}
                }
            })
        })

        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        if (!(document.getElementsByClassName(
            'dragging'
            )[0].parentElement.classList.contains('group')))
        {$('.dragging').wrap("<div class='drag draggable group'></div>")}
        

        

        document.querySelectorAll('.group').forEach(group => {
            newDiv = document.createElement("div")
            newDiv.classList.add('here')
            newDiv.textContent = "СЮДА"
            newDiv.style.position = "absolute"
            newDiv.style.bottom = "0px"
            newDiv.style.left = "0px"
            newDiv.style.color = "red"
            flag = true
            let children = [...group.childNodes]
            children.forEach(
                child => {
                    if (child.textContent == "СЮДА"){
                        flag = false
                    }
                }
            )
            drags = group.querySelectorAll('.draggable')
            drags[drags.length - 1].style.marginBottom = "1rem"
            if (flag){
                group.appendChild(newDiv)
            }
        })
        
        tiles = document.querySelectorAll('.group .draggable')
        tiles.forEach(tile => {
            sib = tile.nextSibling
            if (sib != null) {
                if (sib.nodeName != 'BR' && !sib.classList.contains('here')) {
                    sib.parentElement.insertBefore(document.createElement('br'), sib)
                    tile.style.marginBottom = 0
                    // console.log('br')
                } else if (sib.nextSibling != null) {
                    sib.parentElement.insertBefore(document.createElement('br'), sib)
                    tile.style.marginBottom = 0
                    console.log(sib, 'br')
                }
            } else {
                tile.style.marginBottom = "1rem"
            }
        })

        document.querySelectorAll('br').forEach(
            br => {
                if (br.previousSibling == null || br.nextSibling == null || br.nextSibling.nodeName == 'BR' || 
                    br.nextSibling.classList.contains('here') && br.nextSibling.nextSibling.nodeName == 'BR' ||
                    br.previousSibling.classList.contains('here') && br.previousSibling.previousSibling.nodeName == 'BR') {
                    br.remove()
                }
            }
        )
        
        draggable.classList.remove('dragging')
        draggables = document.querySelectorAll('.draggable')
    })
})

function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset_x = x - box.left
        const offset_y = y - box.bottom
        if (offset_x < 0 && offset_x > closest.offset_x || offset_y > 0 && x < box.right && offset_y < closest.offset_y) {
            return { offset_x: offset_x, offset_y: offset_y, element: child }
        } else {
            return closest
        }
    }, { offset_x: Number.NEGATIVE_INFINITY, offset_y: Number.POSITIVE_INFINITY }).element
}