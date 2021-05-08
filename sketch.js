var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed ,  lastFed , feedTime

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed=createButton("FEED THE DOG");
  feed.position(700 , 95)
  feed.mousePressed(feedDog)
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
 feedTime = database.ref("FeedTime")
 feedTime.on("value" , function(data){
   lastFed = data.val() // val = return the value from the database
 })
   // on is used to read the value from the database 
  //write code to display text lastFed time here
fill("pink")
textSize(15)
if(lastFed>=12){
  text("Last Fed :" + lastFed%12 + "PM" , 350 , 30) // converting to 12 hours format
} 

 else if(lastFed===0){
  text("Last Fed : 12 AM" , 350 , 30) // converting to 12 hours format
 }
 
 else{
  text("Last Fed :" + lastFed + "AM" , 350 , 30) // converting to 12 hours format
 }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var foodStockValue = foodObj.getFoodStock()
  if(foodStockValue <= 0 ){
    foodObj.updateFoodStock(foodStockValue*0)

  }
  else{
    foodObj.updateFoodStock(foodStockValue-1)
  }
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour() // read the hour of computer
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
