var items = [];
var fps = 90;

var mouseX = 0;
var mouseY = 0;
var clickOffsetX = 0;
var clickOffsetY = 0;

class Rectangle {
    constructor(width, height, x, y, color, ctx) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
    }
    draw()
    {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Text {
    constructor(text, x, y, size, color, ctx) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.ctx = ctx;
    }
    draw()
    {
        this.ctx.font = this.size + "px Arial";
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.text, this.x, this.y);
    }
}
var taskHeight = 30;
var taskFontSize = 20;
class Task {
    constructor(name, description, x, y, color, backgroundColor, dependencies, ctx) {
        this.name = name;
        this.description = description;
        this.color = color;
        this.backgroundColor = backgroundColor;
        this.dependencies = dependencies;
        this.x = x;
        this.y = y;
        this.width = this.name.length * taskFontSize * 0.56;
        this.height = taskHeight;
        this.backing = new Rectangle(this.width, this.height, x, y, backgroundColor, ctx);
        this.text = new Text(name, x + 10, y + this.height - 10, taskFontSize, color, ctx);
        if (!this.dependencies)
            this.dependencies = [];
        this.hover = false;
        this.dragging = false;
        this.ctx = ctx;
    }
    draw()
    {
        if (this.hover) 
        {
            this.backing.color = "#8CE6FF";
            if (!this.dragging)
            {
                // draw tooltip
                var tooltip = new Text(this.description, this.x + 20, this.y + this.height + 20, taskFontSize, "black", this.ctx);
                tooltip.draw();
            }
        }
        else
        {
            this.backing.color = this.backgroundColor;
        }
        if (this.dragging)
        {
            this.backing.color = "#3DD5FF";
            this.x = mouseX - clickOffsetX;
            this.y = mouseY - clickOffsetY;
        }
        if (this.selected)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y + this.height / 2);
            this.ctx.lineTo(mouseX, mouseY);
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
        }
        this.backing.x = this.x;
        this.backing.y = this.y;
        this.text.x = this.x + 10;
        this.text.y = this.y + this.height - 10;
        this.backing.draw();
        this.text.draw();
        for (var i = 0; i < this.dependencies.length; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y + this.height / 2);
            this.ctx.lineTo(this.dependencies[i].x + this.dependencies[i].width, this.dependencies[i].y + this.dependencies[i].height / 2);
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
        }
    }  
}

class TaskAddButton {
    constructor(x, y, color, ctx) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
    }
    draw()
    {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 50, 50);
    }
}

function drawAll() {
    // clear the canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < items.length; i++) {
        items[i].draw();
    }
}

function mousemove(e) {
    // hover
    for (var i = 0; i < items.length; i++) {
        if (items[i].x < e.offsetX && items[i].x + items[i].width > e.offsetX && items[i].y < e.offsetY && items[i].y + items[i].height > e.offsetY) {
            items[i].hover = true;
            if (items[i].dragging)
                items[i].selected = false;
        }
        else {
            items[i].hover = false;
        }
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function getSelected() {
    for (var item of items) {
        if (item.selected)
        {
            return item;
        }
    }
    return null;
}

function mousedown(e) {
    var anyClicked = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i].x < e.clientX && items[i].x + items[i].width > e.clientX && items[i].y < e.clientY && items[i].y + items[i].height > e.clientY) {
            clickOffsetX = e.clientX - items[i].x;
            clickOffsetY = e.clientY - items[i].y;
            items[i].dragging = true;
            
            curSelected = getSelected();
            if (curSelected) {
                console.log("!!");
                if (items[i] != curSelected)
                {
                    curSelected.dependencies.push(items[i]);
                }
            }
            else {
                items[i].selected = true;
                anyClicked = true;
            }
        }
        else {
            items[i].dragging = false;
        }
    }
    if (!anyClicked)
        {
            for (var item of items)
            {
                item.selected = false;
            }
        }
}
function mouseup(e) {
    for (var i = 0; i < items.length; i++) {
            items[i].dragging = false;
    }
}

function main() {
    // find the canvas
    var canvas = document.getElementById("canvas");
    // get the context
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    t = new Task("Post Job Ad", "Make a job ad", 100, 100, "black", "lightgrey", [], ctx);
    t2 = new Task("Hire Software Engineer", "Get him paid", 400, 100, "black", "lightgrey", [], ctx);
    t4 = new Task("Hire Software Intern", "Get him paid", 400, 300, "black", "lightgrey", [], ctx);
    items.push(t);
    items.push(t2);
    items.push(t4);
    // draw all on interval
    setInterval(drawAll, 1000/fps);
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mousedown", mousedown);
    canvas.addEventListener("mouseup", mouseup);
}