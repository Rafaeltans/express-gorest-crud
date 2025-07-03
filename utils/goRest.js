const responseAPI = async () => {
    const response = await fetch('https://gorest.co.in/public/v2/users')
    const datas = await response.json()
    return datas
}

const getAPI = async () => {
    const datas = responseAPI()
    return datas
}

const addData = async (formData) => {
    const Gorest_Token = 'Bearer  your_token_here'
    // const body = responseAPI()
    const response = await fetch('https://gorest.co.in/public/v2/users', {
        method: 'POST',
        headers: {
            'Authorization': Gorest_Token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            status: formData.status,
        }),
    })
    const data = await response.json()
    console.log(data)
}

const findData = async (id) => {
    const goRestDatas = await getAPI();
    const goRestData = goRestDatas.find(
        (goRestData) => goRestData.id === id
    )
    return goRestData
};

const updateData = async (id, newData) => {
    const GOREST_TOKEN = 'Bearer  your_token_here';

    const res = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: GOREST_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    });

    return res.json();  // Anda bisa log / periksa jika butuh
};

const deleteData = async (id) => {
    const GOREST_TOKEN = 'Bearer  your_token_here';

    const res = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: GOREST_TOKEN,
            'Content-Type': 'application/json',
        },
    });
    // GoRest: 204 = sukses & body kosong, 404/422 = gagal
    if (res.ok) {
        return { ok: true, status: res.status }; // { ok:true, status:204 }
    }

    // Jika gagal, GoRest tetap kirim JSON array berisi error
    const err = await res.json();
    return { ok: false, status: res.status, error: err };
};

module.exports = { getAPI, addData, findData, updateData, deleteData }