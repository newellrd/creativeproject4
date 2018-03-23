var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: null,
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },
  },
  created: function() {
    this.getItems();
  },
  methods: {
    addItem: function() {
      axios.post("/api/items", {
	       text: this.text,
	       completed: false,
         priority: this.priority
      }).then(response => {
	       this.text = "";
	       this.getItems();
	       return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
	       text: item.text,
	       completed: !item.completed,
         priority: item.priority,
	       orderChange: false,
      }).then(response => {
	       return true;
      }).catch(err => {
      });
    },

    IncrementItem: function(item) {

      if (parseInt(item.priority) === 3)
      {
        return true;
      }

      axios.put("/api/items/" + item.id, {
         text: item.text,
         completed: false,
         priority: parseInt(item.priority) + 1,
         orderChange: false,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    DecrementItem: function(item) {
      if (parseInt(item.priority) === 1)
      {
        return true;
      }
      axios.put("/api/items/" + item.id, {
	       text: item.text,
	       completed: false,
         priority: (parseInt(item.priority)) - 1,
	       orderChange: false,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
	       this.getItems();
	        return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
        if (item.completed)
        this.deleteItem(item)
      });
    },

    sortPriority: function() {

      this.items.sort((a,b)=>{
        return a.priority-b.priority;
      });
    },

    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
	       text: this.drag.text,
	       completed: this.drag.completed,
         orderChange: true,
	       orderTarget: item.id
      }).then(response => {
	       this.getItems();
	       return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get("/api/items").then(response => {
	      this.items = response.data;
	      return true;
      }).catch(err => {
      });
    },
  }
});
