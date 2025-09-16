import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', (resolver) => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'User Test',
      },
    ]);
  }),
  http.post('/api/messages', async ({ request }) => {
    const authToken = request.headers.get('Authorization');
    if (!authToken)
      return HttpResponse.json({ msg: 'Unauthorized' }, { status: 401 });
    const requestBody = await request.json();
    return HttpResponse.json(
      {
        content: requestBody.content,
        createdAt: new Date().toLocaleString(),
      },
      { status: 201 }
    );
  }),
  http.put('/api/messages/:id', async ({ request, params }) => {
    const authToken = request.headers.get('Authorization');
    if (!authToken)
      return HttpResponse.json({ msg: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const requestBody = await request.json();

    // Simular actualización del mensaje
    return HttpResponse.json(
      {
        id: parseInt(id),
        content: requestBody.content,
        updatedAt: new Date().toLocaleString(),
        msg: 'Mensaje actualizado exitosamente',
      },
      { status: 200 }
    );
  }),
  http.delete('/api/messages/:id', async ({ request, params }) => {
    const authToken = request.headers.get('Authorization');
    if (!authToken)
      return HttpResponse.json({ msg: 'Unauthorized' }, { status: 401 });

    const { id } = params;

    // Simular eliminación del mensaje
    return HttpResponse.json(
      {
        id: parseInt(id),
        msg: 'Mensaje eliminado exitosamente',
        deletedAt: new Date().toLocaleString(),
      },
      { status: 200 }
    );
  }),
];
