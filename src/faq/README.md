# FAQ Block

Block FAQ adalah komponen WordPress Gutenberg yang memungkinkan Anda menampilkan pertanyaan dan jawaban dalam format accordion dengan animasi yang smooth.

## Fitur

- Tampilan accordion yang responsif dengan animasi smooth
- Opsi untuk mengizinkan beberapa item terbuka secara bersamaan
- Opsi untuk membuka semua item secara default
- Judul section yang dapat dikustomisasi
- Berbagai opsi kustomisasi tampilan:
  - Warna teks dan latar belakang
  - Ukuran font
  - Warna dan lebar border
  - Jenis dan posisi ikon
  - Padding dan spacing

## Penggunaan

1. Tambahkan block FAQ ke halaman atau post Anda melalui editor Gutenberg
2. Secara default, block akan memiliki satu item FAQ
3. Klik tombol "Add FAQ Item" untuk menambahkan lebih banyak item
4. Klik pada header item untuk membuka/menutup konten dalam editor
5. Gunakan panel pengaturan di sidebar untuk menyesuaikan tampilan block

## Opsi Kustomisasi

### Pengaturan Umum

- **Allow Multiple Open**: Mengizinkan beberapa item FAQ terbuka secara bersamaan
- **Initially Open**: Membuka semua item FAQ secara default saat halaman dimuat
- **Title Tag**: Tag HTML untuk judul item FAQ (h2, h3, h4, h5, h6, p)
- **Title Font Size**: Ukuran font untuk judul item FAQ
- **Content Font Size**: Ukuran font untuk konten item FAQ

### Judul Section

- **Section Title**: Teks untuk judul section FAQ
- **Section Title Tag**: Tag HTML untuk judul section (h1, h2, h3, h4, h5, h6)
- **Section Title Font Size**: Ukuran font untuk judul section
- **Section Title Alignment**: Perataan judul section (kiri, tengah, kanan)

### Tampilan

- **Border Width**: Ketebalan border item FAQ
- **Border Radius**: Radius sudut border item FAQ
- **Item Spacing**: Jarak antar item FAQ
- **Padding**: Padding internal untuk item FAQ
- **Icon Position**: Posisi ikon (kiri atau kanan)
- **Icon Type**: Jenis ikon (plus/minus atau panah)

### Warna

- **Title Color**: Warna teks untuk judul item FAQ
- **Content Color**: Warna teks untuk konten item FAQ
- **Section Title Color**: Warna teks untuk judul section
- **Border Color**: Warna border item FAQ
- **Background Color**: Warna latar belakang item FAQ
- **Active Background Color**: Warna latar belakang item FAQ saat terbuka
- **Icon Color**: Warna ikon

## Contoh Penggunaan

```
[FAQ Block]
├── Judul Section: "Frequently Asked Questions"
│
├── FAQ Item 1
│   ├── Question: "Apa itu WordPress?"
│   └── Answer: "WordPress adalah platform manajemen konten open-source..."
│
├── FAQ Item 2
│   ├── Question: "Bagaimana cara menginstall plugin?"
│   └── Answer: "Anda dapat menginstall plugin melalui dashboard WordPress..."
│
└── FAQ Item 3
    ├── Question: "Apa itu Gutenberg?"
    └── Answer: "Gutenberg adalah editor konten modern untuk WordPress..."
```
