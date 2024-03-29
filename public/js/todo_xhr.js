var todoApp = angular.module('todoApp', []);

todoApp.controller('TodoController', function($scope, $http) {

    $scope.todos = [];
    $scope.loaded = false;
    
    $http.get('/todos')
    .success(function(todos) {
      
    }).error(function(err) {
      alert(err);
    });
    
    $http.get('/todos').success(function(data, status, headers, config) {
        $scope.loaded = true;
        $scope.todos = data;
    });

    $scope.addTodo = function(title) {
        if (title) {
            var new_todo = {
                title: title,
                completed: false,
                id: generateID()
            };
            $http.post('/todos', new_todo).success(function(data, status, headers, config) {
                $scope.newTodoTitle = '';
                $scope.todos.push(new_todo);
            });
        }
    };

    $scope.changeCompleted = function(todo) {
        // Update the todo
        var message = (todo.completed === true) ? 'Task Completed!' : 'Task Uncompleted!';
    };

    $scope.removeCompletedItems = function() {
        var uncompleted_todos = [];
        $scope.todos.forEach(function(todo) {
            if (todo.completed === true) {
                console.log(todo.id);
                deleteTodo(todo.id);
            }
            else {
                uncompleted_todos.push(todo);
            }
        });
        $scope.todos = uncompleted_todos;
    };

    function deleteTodo(id) {
        $http.delete('/todos/' + id).success(function(data, status, headers, config) {
            if (data.result === 'success') {
                console.log('Todo deleted! ID: ' + id);
            } else {
                console.log('Something went wrong: ' + data.error);
            }
        });
    }

    function generateID() {
        var rand = Math.random();
        $scope.todos.forEach(function(todo) {
            if (todo.id === rand) {
                generateID();
            }
        });
        return rand;
    }

});