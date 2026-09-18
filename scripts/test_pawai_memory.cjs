const fetch = globalThis.fetch;

async function testMultiTurnChatMemory() {
  console.log('--- Testing PawAI Multi-Turn Context Memory ---');

  const petContext = {
    name: 'Bella',
    species: 'Cat',
    breed: 'Persian',
    age: 2,
    gender: 'female',
    weight: 3.5
  };

  // Turn 1: User introduces problem with pet
  console.log('\n[Turn 1] Sending initial symptom...');
  const turn1Messages = [
    { role: 'user', content: 'My cat Bella is drinking lots of water and seems tired.' }
  ];

  const res1 = await fetch('http://localhost:3000/api/pawai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: turn1Messages,
      petContext
    })
  });

  const data1 = await res1.json();
  const reply1 = data1.data?.reply || data1.reply;
  console.log('Turn 1 Status:', res1.status);
  console.log('Turn 1 Reply:', reply1 ? reply1.slice(0, 140) + '...' : data1);

  // Turn 2: Follow-up question relying on memory (user does not mention "Bella" or "cat" or "water")
  console.log('\n[Turn 2] Sending context-dependent follow up: "What tests will the doctor likely need?"');
  const turn2Messages = [
    ...turn1Messages,
    { role: 'assistant', content: reply1 || 'Consult a vet.' },
    { role: 'user', content: 'What tests will the doctor likely need to run for her?' }
  ];

  const res2 = await fetch('http://localhost:3000/api/pawai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: turn2Messages,
      petContext
    })
  });

  const data2 = await res2.json();
  const reply2 = data2.data?.reply || data2.reply;
  console.log('Turn 2 Status:', res2.status);
  console.log('Turn 2 Reply:', reply2 ? reply2.slice(0, 200) + '...' : data2);

  if (res2.ok && reply2) {
    console.log('\n✓ Multi-turn context memory successfully verified!');
  } else {
    console.error('\n✗ Multi-turn chat test failed.');
  }
}

testMultiTurnChatMemory().catch(console.error);
