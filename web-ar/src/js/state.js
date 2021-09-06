const gameUpdates = [];

export function processGameUpdate(update){
  gameUpdates.push(update)
  // console.log(gameUpdates)
} 

export function getCurrentState(){
  if(gameUpdates.length > 0){
    return gameUpdates[gameUpdates.length - 1]
  }else{
    return []
  }
}

export const emitControl = data => {
  socket.emit(Constants.MSG_TYPES.INPUT, data);
}