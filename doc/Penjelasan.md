**File ini menjelaskan secara garis besar apa yang mau dibuat**

# Topik
Website Jual Buku

# Teknologi
- nodejs (dengan sqlite3, express, dan ejs)
- podman

# Struktur File

- UTSPO
	- lib
	- view
	- db
	- doc
	- report
	- README.md
	- package.json
	- tsconfig.json
	- main.js
	- containerfile
	- .containerignore

*folder lib* untuk file js selain main.js

*folder view* untuk file ejs

*folder db* untuk menaruh database uang dibuat sqlite

*folder doc* untuk file md selain README.md

# Penjelasan Database

## Struktur

- **books**
	- **id**
		- **type** INTEGER
		- **primary key**
	- **title**
		- **type** TEXT
	- **author**
		- **type** TEXT
	- **price**
		- **type** INTEGER
	- **amount**
		- **type** INTEGER
- **stocks**
	- **id**
		- **type** INTEGER
		- **primary key**
		- **foreign key** books(id)
	- **price**
		- **type** INTEGER
	- **amount**
		- **type** INTEGER
- **users**
	- **email**
		- **type** TEXT
		- **primary key**
	- **name**
		- **type** TEXT
	- **password**
		- **type** TEXT
- **payments**
	- **id**
		- **type** INTEGER
		- **primary key**
	- **bookId**
		- **type** INTEGER
		- **foreign key** books(id)
	- **amount**
		- **type** INTEGER
	- **userEmail**
		- **type** TEXT
		- **foreign key** users(email)
	- **total**
		- **type** INTEGER
	- **status**
		- **type** TEXT

## Penjelasan

- tabel *users* untuk data pengguna.
- tabel *books* untuk data buku.
- tabel *stocks* untuk data harga dan jumlah buku. Id *stock* sama dengan id buku yang dimana harga dan jumlahnya di lacak.
- tabel *payment* untuk melacak pembayaran pengguna. Jika pengguna membeli buku yang berbeda tiap buku memiliki pembayaran id yang berbeda untuk pengguna yang sama.
- *status* dalam *payment* bisa mempunyai nilai berikut: "pending", "done", "fail".

# Website

Website memiliki halaman *login*, *home*, *payment*

## Halaman *login*

Untuk login pengguna

## Halaman *home*

Menampilkan harga dan jumlah tiap buku. Pengguna dapat menambahkan buku ke dalam keranjang jika jumlah buku lebih dari 0 dan jumlah yang di taruh tidak melebihi jumlah buku.

Jumlah buku dikurang setelah user melakukan pembayaran terhadap buku tersebut.

## Halaman *payment*

Manampilkan keranjang pengguna. Pengguna dapat mengurangi atau menambah buku yang ada di dalam keranjang.

Menapilkan total harga semua buku dalam keranjang dan dapat melakukan penbayaran.

# Deploy

Jalankan server dengan podman dan dapat diakses melalui localhost.


# Laporan

otw
