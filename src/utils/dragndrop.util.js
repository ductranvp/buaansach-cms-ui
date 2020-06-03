import {Sortable} from "sortablejs";

function getNewPos(current, before, after, positionKey) {
  const increment = Math.pow(2, 16);
  let newPos = current[positionKey];
  let updateList = false;

  if (before && after) {
    /* Neu co the truoc va sau thi lay trung binh */
    newPos = Math.floor((before[positionKey] + after[positionKey]) / 2);
    if (newPos === before[positionKey] || newPos === after[positionKey] || newPos === 0) updateList = true;
  } else if (before) {
    /* New co the truoc */
    if (before[positionKey] >= current[positionKey]) /* Neu the truoc lon hon the hien tai thi tang */
      newPos = before[positionKey] + increment;
  } else if (after) {
    if (after[positionKey] <= current[positionKey]) {
      newPos = Math.floor(after[positionKey] / 2);
      if (newPos === after[positionKey] || newPos === 0) updateList = true;
    }
  }
  return {
    newPos: newPos,
    updateList: updateList
  };
}

function setSortable(vm, el, handle) {
  return Sortable.create(el, {
    animation: 150,
    dragClass: 'sortable-drag',
    chosenClass: 'sortable-chosen',
    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
    handle: '.drag-handler', // Class name for the drop placeholder,
    setData: function(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '');
    },
    onEnd: evt => {
      handle(evt);
    }
  });
}

const DragNDropUtils = {
  getNewPos: getNewPos,
  setSortable: setSortable
};

export default DragNDropUtils;
